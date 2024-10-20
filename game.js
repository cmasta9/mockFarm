import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';
import {addMove,removeMove} from '/input.js';

const canv = document.getElementById('canv');
const alienPath = '/images/alien.png';
const alienPathL = '/images/alienL.png';
let spd = 2;
let scene = [];
var orig = new Transform(canv.offsetWidth/2,canv.offsetHeight/2,spd);

let ctx = canv.getContext('2d');
let al = document.createElement('img');
al.src = alienPath;

let monk = new MonKey(Date.now(),orig);
scene.push(monk);

window.addEventListener('keydown', (e) => {
    monk.trans.inp = addMove(e);
    console.log(monk.trans.inp);
});

window.addEventListener('keyup',(e)=>{
    monk.trans.inp = removeMove(e);
    console.log(monk.trans.inp);
});

window.setInterval(() => {
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    for(let i = 0; i < scene.length; i++){
        //console.log(`scene ${i}: ${scene[i].getId()}`);
        scene[i].trans.translate();
        let pos = [scene[i].trans.x,scene[i].trans.y];
        if(scene[i].trans.inp[0] < 0){
            al.src = alienPathL;
        }else if(scene[i].trans.inp[0] > 0){
            al.src = alienPath;
        }
        ctx.drawImage(al,pos[0],pos[1]);
        //ctx.fillRect(pos[0],pos[1],20,20);
    }
},100);