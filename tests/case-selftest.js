const fs=require('fs');
const path=require('path');
const vm=require('vm');

class Dummy {
  constructor(){
    this.style={setProperty(){}};this.dataset={};this.className='';this.innerHTML='';this.textContent='';
    this.src='';this.disabled=false;this.value='';
    this.classList={add(){},remove(){},toggle(){},contains(){return false}};
  }
  appendChild(){} addEventListener(){} remove(){} setAttribute(){} getAttribute(){return null}
  querySelector(){return new Dummy()} querySelectorAll(){return []}
  getBoundingClientRect(){return {left:0,top:0,width:100,height:100}}
  closest(){return null}
}

const root=path.resolve(__dirname,'..');
const sourcePath=path.join(root,'src','main.js');
const dummies=new Map();
const document={
  querySelector(sel){if(!dummies.has(sel)) dummies.set(sel,new Dummy());return dummies.get(sel)},
  querySelectorAll(){return []}, createElement(){return new Dummy()}, createElementNS(){return new Dummy()}, addEventListener(){}
};
const storage={};
const localStorage={getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v},removeItem(k){delete storage[k]}};
const context={console,document,localStorage,setTimeout(fn){fn();return 0},clearTimeout(){},requestAnimationFrame(fn){fn()},window:null,location:{reload(){}}};
context.window=context;context.window.addEventListener=()=>{};
vm.createContext(context);

let code=fs.readFileSync(sourcePath,'utf8');
code=code.replace('window.__CASE_DEBUG__={',`window.__CASE_DEBUG__={
  testCollect:(id)=>collectEvidence(id),
  testAsk:(sid,tid)=>{currentSuspect=sid;currentTopic=null;selectedInterrogationEvidence=null;const t=suspects[sid].topics.find(x=>x.id===tid);if(!t)throw new Error('Unknown topic '+sid+':'+tid);askTopic(t);return true;},
  testDeduce:(keys,rel)=>{const found=findDeductionForSelection(keys,rel);if(!found)return null;addDeduction(found[0]);return found[0];},
  testReady:()=>deductionReadyForFinal(),
  testTopicAvailable:(sid,tid)=>{const t=suspects[sid].topics.find(x=>x.id===tid);return !!t && isTopicAvailable(sid,t);},
  testRawState:()=>state,
`);
vm.runInContext(code,context,{filename:'main.js'});
const d=context.__CASE_DEBUG__;

function assert(condition,message){if(!condition)throw new Error(message)}
function ded(keys,rel,expected){const got=d.testDeduce(keys,rel);assert(got===expected,`Expected deduction ${expected}, got ${got}`)}

const integrity=d.getIntegrityReport();
assert(integrity.ok,`Integrity errors: ${integrity.errors.join('; ')}`);

const defs=d.definitions;
assert(Object.values(defs.locations).length===7,'Expected 7 locations');
assert(Object.values(defs.suspects).length===6,'Expected 6 characters');
assert(!Object.values(defs.deductionDefs).some(x=>x.relation==='side'),'Side/secret relation must be absent');

// Core fact: the book was on Viktor's desk after the demonstration.
d.testCollect('dustMark');
d.testAsk('dmitry','desk');
ded(['e:dustMark','t:dmitry:desk'],'confirmation','bookOnDesk');

// First disappearance, camera route. Viktor leaves without the book; safe remains in office.
d.testCollect('camera');
d.testCollect('safe');
ded(['d:bookOnDesk','e:camera','e:safe'],'sequence','viktorHidBookCamera');
assert(d.testRawState().deductions.includes('viktorHidBook'),'Canonical Viktor conclusion missing');

// Optional financial branch.
d.testCollect('insurance');
d.testCollect('financialDoc');
ded(['e:insurance','e:financialDoc'],'motive','viktorFinancialMotive');

// Blackout is independently explained by kitchen evidence.
d.testCollect('breakerLog');
d.testAsk('anton','blackout');
ded(['e:breakerLog','t:anton:blackout'],'confirmation','blackoutAccident');

// Marina access route through archive contradiction + family code.
d.testCollect('oldPhoto');
d.testCollect('familyCode');
d.testAsk('marina','knowledge');
ded(['t:marina:knowledge','e:oldPhoto'],'contradiction','marinaKnewSafe');
ded(['d:marinaKnewSafe','e:familyCode','e:safe'],'opportunity','marinaAccessArchive');
assert(d.testRawState().deductions.includes('marinaAccess'),'Canonical Marina access conclusion missing');

// Second movement, camera route.
d.testCollect('cameraMarina');
ded(['d:marinaAccess','e:cameraMarina'],'sequence','marinaMovedCamera');
assert(d.testRawState().deductions.includes('marinaMovedBook'),'Canonical Marina movement conclusion missing');
assert(d.testReady(),'Final must unlock after the three mandatory cores');

// The two-stage synthesis is still a board deduction.
ded(['d:viktorHidBook','d:marinaMovedBook'],'sequence','twoStages');

// Lisa's false alibi is disproved by the staff schedule before her side-deal branch develops.
assert(d.testTopicAvailable('liza','after'),'Lisa initial alibi question must be available');
assert(!d.testTopicAvailable('liza','before'),'Lisa must not reveal eyewitness details before her lie is exposed');
assert(!d.testTopicAvailable('liza','scheduleLie'),'Lisa confrontation must be locked before the schedule is found');
d.testAsk('liza','after');
assert(d.testRawState().flags.staffOpen,'Lisa first answer must open the staff room for verification');
assert(!d.testTopicAvailable('liza','scheduleLie'),'Lisa confrontation must remain locked until the staff schedule is found');
d.testCollect('staffSchedule');
assert(d.testTopicAvailable('liza','scheduleLie'),'Staff schedule must unlock the confrontation with Lisa');
d.testAsk('liza','scheduleLie');
assert(d.testTopicAvailable('liza','before'),'Eyewitness questions may unlock only after Lisa admits she was present');
assert(d.testTopicAvailable('liza','afterTruth'),'Lisa explanation question must unlock after the admission');
d.testAsk('liza','afterTruth');
assert(d.testRawState().talks.liza.scheduleLie,'Lisa must admit the initial lie after the schedule is found');
assert(d.testRawState().talks.liza.afterTruth,'Lisa must explain why she hid her presence at the restaurant');

// Optional branches use ordinary relation types, never a special "secret" type.
d.testCollect('copiedRecipe');
d.testCollect('kitchenLog');
ded(['e:copiedRecipe','e:kitchenLog'],'sequence','antonOldCopy');

d.testCollect('lizaPayment');
d.testAsk('liza','payment');
d.testCollect('recipePhotos');
ded(['e:lizaPayment','t:liza:payment','e:recipePhotos'],'confirmation','pavelLizaDeal');

d.testAsk('dmitry','father');
d.testCollect('archiveLetter');
ded(['e:archiveLetter','t:dmitry:father'],'confirmation','dmitryHistory');

d.testAsk('marina','family');
d.testCollect('archiveOwnership');
ded(['t:marina:family','e:archiveOwnership'],'motive','marinaFamilyMotive');

// Kitchen-based independent route for Marina's movement remains valid.
d.testCollect('linenNapkin');
d.testAsk('anton','napkin');
ded(['d:marinaAccess','e:linenNapkin','t:anton:napkin'],'sequence','marinaMovedKitchen');

console.log('CASE SELFTEST: PASS');
console.log(JSON.stringify({
  finalReady:d.testReady(),
  deductions:d.testRawState().deductions,
  evidence:d.testRawState().evidence.length,
  integrityWarnings:integrity.warnings
},null,2));
