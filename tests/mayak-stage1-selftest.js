const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'src','mayak.js'),'utf8');
const main=fs.readFileSync(path.join(root,'src','main.js'),'utf8');
let errors=[];
for(const id of ['stepan','kirill','maxim']){
  if(!js.includes(`${id}:{`)) errors.push(`Missing start suspect: ${id}`);
  if(!fs.existsSync(path.join(root,'assets','cases','mayak','portraits',`${id}.png`))) errors.push(`Missing interrogation portrait crop: ${id}`);
}
for(const token of ["['stepan','failure'","['kirill','cause'","['maxim','alibi'"]){
  if(!js.includes(token)) errors.push(`Missing intro requirement: ${token}`);
}
if(!js.includes('state.mapUnlocked=true')) errors.push('Intro completion does not unlock the island map');
if(!js.includes("if(!state.mapUnlocked){ toast('Сначала поговорите со Степаном, Кириллом и Максимом.')")) errors.push('Map lock before the three start interviews is missing');
if(js.includes('places.central1.variants.afterIntro') || js.includes('places.central1.variants.final')) errors.push('Central hall background must stay constant across investigation stages');
if(!js.includes('return places.central1.img;')) errors.push('Central hall must always use central-1.png');
if(!js.includes('data-mayak-suspect')) errors.push('No interactive suspect hotspots for Mayak');
if(!js.includes('window.DetectivePanels.notebook')) errors.push('Mayak notebook must use the shared notebook renderer');
if(!main.includes("dataset.case==='mayak' && window.MayakCase?.closeInterrogation")) errors.push('Shared interrogation shell does not delegate back to Mayak');
if(!html.includes('id="interrogation"')) errors.push('Shared interrogation shell missing');
if(!html.includes('src/ui-panels.js')) errors.push('Universal panel renderer is not loaded');
for(const method of ['people','materials','notebook','investigation']) if(!js.includes(`window.DetectivePanels.${method}`)) errors.push(`Mayak does not use shared panel renderer: ${method}`);
if(errors.length){ console.error('MAYAK STAGE1 FAIL'); errors.forEach(e=>console.error('-',e)); process.exit(1); }
console.log('MAYAK STAGE1 PASS');
