import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';

const canv = document.getElementById('canv');
const alienPath = '/images/alien.png';
let spd = 2;
let scene = [];
var orig = new Transform(canv.offsetWidth/2,canv.offsetHeight/2,spd);

let ctx = canv.getContext('2d');
let al = document.createElement('img');
al.src = alienPath;

let monk = new MonKey(Date.now(),orig);
scene.push(monk);

window.addEventListener('keydown', (e) => {
    if(e.code == 'ArrowRight'){
        monk.trans.translate(1,0);
    }
    if(e.code == 'ArrowLeft'){
        monk.trans.translate(-1,0);
    }
    if(e.code == 'ArrowUp'){
        monk.trans.translate(0,-1);
    }
    if(e.code == 'ArrowDown'){
        monk.trans.translate(0,1);
    }
    if(e.code == 'KeyP'){
        let monk3 = new MonKey();
        scene.push(monk3);
    }
})

window.setInterval(() => {
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    for(let i = 0; i < scene.length; i++){
        //console.log(`scene ${i}: ${scene[i].getId()}`);
        let pos = [scene[i].trans.x,scene[i].trans.y];
        ctx.drawImage(al,pos[0],pos[1]);
        //ctx.fillRect(pos[0],pos[1],20,20);
    }
},100);