const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const errors=[];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const engine=fs.readFileSync(path.join(root,'src/collectibles.js'),'utf8');
const mayak=fs.readFileSync(path.join(root,'src/mayak.js'),'utf8');
const main=fs.readFileSync(path.join(root,'src/main.js'),'utf8');

if(!html.includes('id="sceneObjects" class="scene-objects"')) errors.push('Family Recipe scene objects layer missing');
if(!html.includes('id="mayakSceneObjects" class="scene-objects"')) errors.push('Mayak scene objects layer missing');
if(!html.includes('src/collectibles.js')) errors.push('Universal collectibles script not loaded');
if(html.indexOf('src/collectibles.js')>html.indexOf('src/main.js')) errors.push('Collectibles engine loads after case script');
if(!engine.includes('window.DetectiveCollectibles')) errors.push('Universal API missing');
if(!engine.includes('`${box.x}%`')||!engine.includes('`${box.y}%`')||!engine.includes('`${box.w}%`')||!engine.includes('`${box.h}%`')) errors.push('Collectibles are not percentage-positioned');
if(!css.includes('.collectible-object-image')) errors.push('Collectible visual CSS missing');
if(!css.includes('@media (pointer:coarse)')) errors.push('Touch hit-area adaptation missing');
if(!main.includes("host:'#sceneObjects'")) errors.push('Family Recipe is not wired to universal engine');
if(!mayak.includes("host:'#mayakSceneObjects'")) errors.push('Mayak is not wired to universal engine');

// Load the unchanged game in an isolated browser stub and use its real click handler.
const check=(condition,message)=>{if(!condition) errors.push(message);};
const classList={add(){},remove(){},contains(){return true;}};
const hotspotHost={innerHTML:''};
const sceneBg={style:{},setAttribute(){}};
const nodes={
  '#mayakHotspots':hotspotHost,
  '#mayakSceneBg':sceneBg,
  '#mayakScene':{dataset:{}},
  '#mayakLocationTitle':{textContent:''}
};
const clickHandlers=[];
const saved=new Map();
const sandbox={
  window:{},
  localStorage:{
    getItem:key=>saved.get(key)||null,
    setItem:(key,value)=>saved.set(key,String(value)),
    removeItem:key=>saved.delete(key)
  },
  document:{
    querySelector:selector=>nodes[selector]||null,
    querySelectorAll:()=>[],
    addEventListener:(type,handler)=>{if(type==='click') clickHandlers.push(handler);},
    body:{classList}
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'src/ui-panels.js'),'utf8'),sandbox,
  {filename:'src/ui-panels.js',timeout:5000});
vm.runInContext(mayak,sandbox,{filename:'src/mayak.js',timeout:5000});
const game=sandbox.window.MayakCase;
const journalId='hotspot_stepan_log';
const evidenceId='ev_stepan_log_edit';
const journal=game.definitions.sceneHotspots.central1.find(item=>item.id===journalId);
const collectibles=Object.values(game.definitions.collectibleDefs).flat();
check(!collectibles.some(item=>
  ['collect_stepan_log',journalId].includes(item.id) ||
  item.evidence===evidenceId || (item.grants||[]).includes(evidenceId)
),'Stepan journal must not be a separate DetectiveCollectibles object');
check(!!journal,'Stepan journal hotspot is missing from sceneHotspots.central1');
check(journal?.grants?.includes(evidenceId),'Stepan journal hotspot must grant ev_stepan_log_edit');
check(journal?.persistent===true,'Stepan journal hotspot must remain available after inspection');
check(journal?.stealth===true,'Stepan journal hotspot must use invisible area styling');

game.openPlace('central1');
const journalButton=()=>hotspotHost.innerHTML.match(/<button\b[^>]*data-mayak-hotspot="hotspot_stepan_log"[^>]*>[\s\S]*?<\/button>/)?.[0];
check(!!journalButton(),'Stepan journal hotspot must be rendered before inspection');
check(/class="[^"]*\bstealth-evidence-hotspot\b/.test(journalButton()||''),
  'Stepan journal hotspot must render with stealth styling');
check(!/<img\b/.test(journalButton()||''),'Stepan journal hotspot must not draw another journal image');
const originalBackground=sceneBg.style.backgroundImage;
const clickJournal=()=>{
  const button={dataset:{mayakHotspot:journalId}};
  const event={
    target:{closest:selector=>selector==='[data-mayak-hotspot]'?button:null},
    preventDefault(){},stopPropagation(){}
  };
  clickHandlers.forEach(handler=>handler(event));
};
const journalEvidenceCount=()=>game.getState().evidence.filter(id=>id===evidenceId).length;
check(journalEvidenceCount()===0,'Stepan journal evidence must start uncollected');
clickJournal();
check(journalEvidenceCount()===1,'First journal click must grant its evidence exactly once');
check(!!journalButton(),'Stepan journal hotspot must remain after the first click');
const firstClickEvidence=JSON.stringify(game.getState().evidence);
clickJournal();
check(journalEvidenceCount()===1 && JSON.stringify(game.getState().evidence)===firstClickEvidence,
  'Repeated journal click must not duplicate or add evidence');
check(!!journalButton(),'Stepan journal hotspot must remain after repeated inspection');
check(sceneBg.style.backgroundImage===originalBackground,'Journal inspection must not change the background');
game.openPlace('central1');
check(!!journalButton(),'Inspected journal hotspot must remain when returning to central1');

// Check the important CSS protections for the area itself, excluding its allowed label.
const cssRules=[...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)];
function hasImportantRule(selector,property,value){
  return cssRules.some(([,selectors,body])=>
    selectors.split(',').some(s=>s.trim()===selector) &&
    body.split(';').some(declaration=>{
      const colon=declaration.indexOf(':');
      return declaration.slice(0,colon).trim()===property &&
        declaration.slice(colon+1).replace(/\s/g,'')===`${value}!important`;
    })
  );
}
for(const [property,value] of [['border-color','transparent'],['background','transparent'],['box-shadow','none']]){
  check(hasImportantRule('.stealth-evidence-hotspot',property,value),
    `Journal area must suppress ${property}, including hover/focus`);
}
for(const state of ['',':hover',':focus-visible']){
  for(const pseudo of ['::before','::after']){
    check(hasImportantRule(`.hotspot${state}${pseudo}`,'display','none'),
      `Journal area must have no visual ${pseudo} decoration in ${state||'normal'} state`);
  }
  check(hasImportantRule(`.hotspot${state}`,'outline','none'),
    `Journal area must have no outline in ${state||'normal'} state`);
}

if(errors.length){ console.error('COLLECTIBLES SELFTEST FAIL'); errors.forEach(e=>console.error('-',e)); process.exit(1); }
console.log('COLLECTIBLES SELFTEST PASS');
