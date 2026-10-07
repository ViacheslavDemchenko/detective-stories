const path=require('path');
const root=path.resolve(__dirname,'..');

// Minimal browser stubs: enough to load the case data without rendering UI.
global.window={};
global.localStorage={
  data:new Map(),
  getItem(k){return this.data.has(k)?this.data.get(k):null;},
  setItem(k,v){this.data.set(k,String(v));},
  removeItem(k){this.data.delete(k);}
};
const nullClassList={add(){},remove(){},contains(){return true;}};
global.document={
  querySelector(){return null;},
  querySelectorAll(){return [];},
  addEventListener(){},
  body:{classList:nullClassList}
};

require(path.join(root,'src','ui-panels.js'));
require(path.join(root,'src','mayak.js'));
const d=window.MayakCase?.definitions;
let errors=[];
if(!d){console.error('MAYAK FULL SELFTEST FAIL\n- Case definitions are not exported');process.exit(1);}

const tokens=new Set();
const discussed=new Set();
const evidence=new Set();
const conclusions=new Set();
const stages=new Set();
let intro=false;

function has(t){return tokens.has(t);}
function matches(req){
  if(!req)return true;
  if(typeof req==='string')return has(req);
  if(Array.isArray(req))return req.every(has);
  const all=(req.all||[]).every(has);
  const any=!req.any?.length||(req.any||[]).some(has);
  const not=(req.not||[]).every(x=>!has(x));
  return all&&any&&not;
}
function add(t){if(tokens.has(t))return false;tokens.add(t);return true;}

const basePlaces=new Set(['central1','communications','technical','archive','weather','guestHall','pier','generator','fuelStorage']);
const placeOpen=id=>{
  if(id==='central1')return true;
  if(!intro)return false;
  const rule=d.placeUnlockRules[id];
  return !rule||matches(rule);
};

let changed=true, guard=0;
while(changed && guard++<100){
  changed=false;

  // Before the intro only the three starting witnesses are available; after it all seven are.
  const availableSuspects=intro?Object.keys(d.suspects):['stepan','kirill','maxim'];
  for(const sid of availableSuspects){
    for(const topic of d.suspects[sid].topics){
      const key=`topic:${sid}:${topic.id}`;
      if(discussed.has(key)||!matches(topic.requires))continue;
      discussed.add(key); add(key); changed=true;
      for(const g of topic.grants||[]) add(g);
    }
  }

  if(!intro && d.introRequirements.every(([sid,tid])=>has(`topic:${sid}:${tid}`))){
    intro=true; add('intro_complete'); changed=true;
  }

  for(const [id,def] of Object.entries(d.conclusionDefs)){
    if(!conclusions.has(id)&&matches(def.requires)){
      conclusions.add(id); add(id); changed=true;
    }
  }
  for(const [id,def] of Object.entries(d.stageDefs)){
    if(!stages.has(id)&&matches(def.requires)){
      stages.add(id); add(id); changed=true;
    }
  }

  for(const [place,spots] of Object.entries(d.sceneHotspots)){
    if(!placeOpen(place))continue;
    for(const spot of spots){
      if(!matches(spot.requires))continue;
      for(const ev of spot.grants||[]){
        if(!evidence.has(ev)){evidence.add(ev);add(ev);changed=true;}
      }
    }
  }

  for(const [place,items] of Object.entries(d.collectibleDefs||{})){
    if(!placeOpen(place))continue;
    for(const item of items){
      if(!matches(item.requires))continue;
      for(const ev of item.grants||[item.evidence]){
        if(ev && !evidence.has(ev)){evidence.add(ev);add(ev);changed=true;}
      }
    }
  }
}

if(guard>=100)errors.push('Dependency resolution did not converge');
for(const sid of ['stepan','kirill','maxim','irina','anna','oleg','sofia']){
  if(!d.suspects[sid]?.topics?.length)errors.push(`No interrogation topics for ${sid}`);
}
for(const must of [
  'cl_manual_intervention','cl_sabotage_time','cl_separate_failures',
  'cl_stepan_alibi','cl_irina_alibi','cl_anna_alibi','cl_maxim_alibi','cl_oleg_alibi','cl_sofia_alibi',
  'cl_oleg_fuel_theft','cl_oleg_not_main_saboteur','cl_kirill_access','cl_kirill_no_alibi',
  'cl_kirill_hid_faults','cl_kirill_motive','cl_kirill_lied_module','cl_kirill_module_link','stage_final_ready'
]) if(!has(must))errors.push(`Unreachable required result: ${must}`);
for(const room of ['maximRoom','sofiaRoom','kirillRoom']) if(!placeOpen(room)) errors.push(`Locked room is unreachable: ${room}`);
for(const ev of ['ev_modernization_docs','ev_sofia_photos','ev_kirill_module']) if(!has(ev))errors.push(`Required room evidence is unreachable: ${ev}`);
for(const key of ['stepan:alibi','irina:alibi','anna:alibi','maxim:alibi','oleg:alibi','sofia:alibi','kirill:alibi']){
  const def=d.matrixCellDefs[key];
  if(!def)errors.push(`Missing required matrix cell: ${key}`);
  else if(!(def.routes||[]).some(r=>(r.requires||[]).every(k=>{
    const [kind,id]=k.split(':');
    return (kind==='e'&&has(id))||(kind==='t'&&has(id))||(kind==='d'&&has(id));
  }))) errors.push(`Required matrix alibi cell cannot be resolved: ${key}`);
}

if(errors.length){
  console.error('MAYAK FULL SELFTEST FAIL');
  errors.forEach(e=>console.error('-',e));
  process.exit(1);
}
console.log('MAYAK FULL SELFTEST PASS');
console.log(JSON.stringify({topics:discussed.size,evidence:evidence.size,conclusions:conclusions.size,stages:[...stages]},null,2));
