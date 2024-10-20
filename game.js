import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';

const canv = document.getElementById('canv');
const alienPath = '/images/alien.png';
let spd = 2;
let scene = [];
let orig = new Transform(canv.offsetWidth/2,canv.offsetHeight/2,spd);
console.log(orig.getX(),orig.getY(),orig.getSpd());

let ctx = canv.getContext('2d');
let al = document.createElement('img');
document.body.appendChild(al);
al.src = alienPath;

let monk = new MonKey(Date.now(),orig);
console.log(orig.getX(),orig.getY(),orig.getSpd());
monk.getTrans().setX(orig.getX());
console.log(monk.getName(), monk.getId(), monk.getTrans().getX());
scene.push(monk);

//let monk2 = new MonKey();

//scene.push(monk2);

window.addEventListener('keydown', (e) => {
    if(e.code == 'ArrowRight'){
        monk.getTrans().translate(1,0);
        console.log(monk.getTrans().getX());
    }
    if(e.code == 'ArrowLeft'){
        monk.getTrans().translate(-1,0);
        console.log(monk.getTrans().getX());
    }
    if(e.code == 'ArrowUp'){
        monk.getTrans().translate(0,-1);
        console.log(monk.getTrans().getY());
    }
    if(e.code == 'ArrowDown'){
        monk.getTrans().translate(0,1);
        console.log(monk.getTrans().getY());
    }
    if(e.code == 'KeyP'){
        let monk3 = new MonKey();
        scene.push(monk3);
        console.log(monk3.getId());
    }
    console.log(e.code);
})

window.setInterval(() => {
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    for(let i = 0; i < scene.length; i++){
        //console.log(`scene ${i}: ${scene[i].getId()}`);
        let pos = [scene[i].getTrans().getX(),scene[i].getTrans().getY()];
        ctx.fillRect(pos[0],pos[1],20,20);
        //console.log(pos[0],pos[1]);
    }
},100);