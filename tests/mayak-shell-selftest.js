const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'src','mayak.js'),'utf8');
const responsive=fs.readFileSync(path.join(root,'responsive.css'),'utf8');
const required=[
  'central-1.png','communications.png','technical.png','archive.png',
  'weather.png','guest-hall.png','kirill-room.png','maxim-room.png','sofia-room.png','pier.png','generator.png','fuel-storage.png'
];
let errors=[];
if(!html.includes('ДЕЛО №2')||!html.includes('>Маяк<')) errors.push('Case #2 card is missing');
if(!html.includes('id="mayakMapScreen"')) errors.push('Map screen is missing');
if(!html.includes('id="mayakSceneScreen"')) errors.push('Scene screen is missing');
for(const f of required){
  const p=path.join(root,'assets','cases','mayak','locations',f);
  if(!fs.existsSync(p)) errors.push(`Missing scene: ${f}`);
  if(!js.includes(`locations/${f}`)) errors.push(`Scene not referenced in config: ${f}`);
}
if(!fs.existsSync(path.join(root,'assets','cases','mayak','ui','island-map.png'))) errors.push('Island map missing');
if(!fs.existsSync(path.join(root,'assets','cases','mayak','ui','prologue.png'))) errors.push('Prologue missing');

const mapStart=html.indexOf('id="mayakMapScreen"');
const sceneStart=html.indexOf('id="mayakSceneScreen"');
const chooserStart=html.indexOf('id="mayakPlaceChooser"');
if(!(mapStart>=0 && chooserStart>mapStart && chooserStart<sceneStart)) errors.push('Place chooser must live inside the map screen so its backdrop cannot cover the header');
if(!responsive.includes(`#mayakPlaceChooser{\n  position:static!important;`)) errors.push('Mayak chooser must use Grid/static positioning, not viewport absolute positioning');
if(!responsive.includes(`#mayakPlaceChooser .modal-backdrop{\n  position:static!important;`)) errors.push('Mayak chooser backdrop must be a Grid layer, not absolute');
if(!responsive.includes(`.mayak-topbar,.mayak-map-screen>.topbar{\n  position:static!important;`)) errors.push('Mayak map header must participate in the screen Grid');
const sceneBlock=html.slice(sceneStart, html.indexOf('<div id="toast"', sceneStart));
if(!sceneBlock.includes('class="screen game-screen mayak-scene-screen"')) errors.push('Mayak room screen must reuse the universal game-screen shell');
for(const cls of ['class="topbar glass"','class="scene"','class="scene-stage"','class="scene-bg"','class="dock glass"']){
  if(!sceneBlock.includes(cls)) errors.push(`Mayak room shell missing universal structure: ${cls}`);
}
if(sceneBlock.includes('mayak-scene-main')||sceneBlock.includes('mayak-scene-frame')) errors.push('Mayak must not use a separate room layout');
if(!sceneBlock.includes('>Люди<')||!sceneBlock.includes('>Материалы<')||!sceneBlock.includes('>Блокнот<')||!sceneBlock.includes('>Расследование<')) errors.push('Mayak room dock must match case #1');
if(errors.length){ console.error('MAYAK SHELL FAIL'); errors.forEach(e=>console.error('-',e)); process.exit(1); }
console.log('MAYAK SHELL PASS');

if(sceneBlock.includes('data-mayak-panel')) errors.push('Mayak must use the same data-panel dock contract as every other case');
