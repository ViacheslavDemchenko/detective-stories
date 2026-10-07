const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const main=fs.readFileSync(path.join(root,'src','main.js'),'utf8');
const mayak=fs.readFileSync(path.join(root,'src','mayak.js'),'utf8');
const ui=fs.readFileSync(path.join(root,'src','ui-panels.js'),'utf8');
let errors=[];
const uiPos=html.indexOf('src/ui-panels.js');
const mainPos=html.indexOf('src/main.js');
const mayakPos=html.indexOf('src/mayak.js');
if(!(uiPos>=0 && uiPos<mainPos && uiPos<mayakPos)) errors.push('Shared panel renderer must load before all case scripts');
for(const method of ['people','materials','notebook','suspectMatrixHtml','investigation']){
  if(!ui.includes(`function ${method}`)) errors.push(`Shared renderer missing ${method}`);
  if(!main.includes(`window.DetectivePanels.${method}`)) errors.push(`Case #1 is not using shared ${method} renderer`);
  if(!mayak.includes(`window.DetectivePanels.${method}`)) errors.push(`Case #2 is not using shared ${method} renderer`);
}
if(html.includes('data-mayak-panel')) errors.push('Case-specific dock panel contract still exists');
if(mayak.includes('function openMayakModal')) errors.push('Case-specific modal renderer still exists');

if(mayak.includes('data-mayak-matrix-cell')) errors.push('Case #2 still uses a case-specific matrix-cell contract');
if(!ui.includes('function resetMatrixViewport')) errors.push('Shared matrix viewport reset is missing');
for(const portrait of ['stepan','kirill','maxim']){
  if(!mayak.includes(`assets/cases/mayak/characters/${portrait}.png`)) errors.push(`Case #2 ${portrait} does not use the canonical full-body character reference`);
}

for(const structuralClass of ['case-tools-shell','suspect-matrix-layout','suspect-matrix-main','suspect-matrix-table']){
  if(mayak.includes(`class="${structuralClass}`)) errors.push(`Case #2 contains duplicated structural markup: ${structuralClass}`);
}
if(!main.includes('window.DetectivePanels.suspectMatrixHtml')) errors.push('Case #1 matrix is not using the shared matrix renderer');
if(!mayak.includes('window.DetectivePanels.suspectMatrixHtml')) errors.push('Case #2 matrix is not using the shared matrix renderer');

if(errors.length){console.error('UNIVERSAL PANELS FAIL');errors.forEach(e=>console.error('-',e));process.exit(1);}
console.log('UNIVERSAL PANELS PASS');
