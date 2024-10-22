import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';
import {Scene} from '/scene.js';
import {addMove,removeMove} from '/input.js';
import { objToString,objToJson,stringToMap,stringToJson,parseString,stringToArr } from '/monkeyMap.js';

let wsOpen = false;

const flag = true;

const hostUrl = 'localhost:4200';
let monk = null;

const canv = document.getElementById('canv');
let scene = new Scene();
let ctx = canv.getContext('2d');

const ws = new WebSocket(`ws://${hostUrl}`);
ws.addEventListener('open',(e)=>{
    ws.send('Assignment');
    wsOpen = true;
});
ws.addEventListener('close',(e)=>{
    wsOpen = false;
    window.alert('connection to websocket closed');
    console.log(`Connection closed: ${e.data}`);
});
ws.addEventListener('message',(e)=>{
    //console.log(`Received a message from the server: ${e.data}`);
    const ass = JSON.parse(e.data);
    if(ass.assignment != null){
        console.log('added new user');
        monk = new MonKey(ass.assignment);
        spawn(monk,new Transform(canv.offsetWidth/2,canv.offsetHeight/2));
        document.getElementById('users').innerText = `Users: ${scene.actors.size}`;
    }else if(ass.monkeys != null){
        document.getElementById('users').innerText = `Users: ${scene.actors.size}`;
        const monks = stringToMap(parseString(ass.monkeys));
        for(const j of monks.keys()){
            if(stringToArr(j)[0] != monk.id && j != ''){
                scene.actors.set(stringToArr(j)[0],monks.get(j));
            }
        }
        //logActors();
    }
});

window.addEventListener('keydown', (e) =>{
    monk.moveD(addMove(e));
});

window.addEventListener('keyup',(e)=>{
    monk.moveU(removeMove(e));
});

const update = window.setInterval(() => {
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    for(const v of scene.actors.keys()){
        if(v != monk.id){
            const actor = stringToJson(scene.actors.get(v));
            //console.log(actor);
            //actor.trans.translate();
            const pos = [actor.trans.x,actor.trans.y];
            const img = new Image();
            img.src = actor.sprite;
            ctx.drawImage(img,pos[0],pos[1]);
        }
        else{
            const pos = [monk.trans.x,monk.trans.y];
            const img = new Image();
            img.src = monk.getSprite();
            ctx.drawImage(img,pos[0],pos[1]);
        }
    }
},50);

const gei = window.setInterval(()=>{
    if(wsOpen && scene.actors.size > 0){
        const packet = objToString(monk);
        ws.send(JSON.stringify(packet));
    }
},420);

const dei = window.setInterval(()=>{
    if(wsOpen){
        ws.send('gimme');
    }
},500);

function spawn(m,t){
    m.trans = t;
    scene.actors.set(m.id,objToJson(m));
}

function logActors(){
    for(const k of scene.actors.keys()){
        console.log(k);
    }
}