const fs=require('fs');
const path=require('path');
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
if(!mayak.includes("id:'collect_stepan_log'")) errors.push('Stepan journal is not a collectible object');
if(mayak.includes("id:'hotspot_stepan_log'")) errors.push('Legacy invisible journal hotspot still exists');
if(!mayak.includes("evidence:'ev_stepan_log_edit'")) errors.push('Stepan journal does not grant evidence');

if(errors.length){ console.error('COLLECTIBLES SELFTEST FAIL'); errors.forEach(e=>console.error('-',e)); process.exit(1); }
console.log('COLLECTIBLES SELFTEST PASS');
