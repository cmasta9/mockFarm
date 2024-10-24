import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';
import {Scene} from '/scene.js';
import {addMove,removeMove} from '/input.js';
import { objToString,objToJson,stringToMap,stringToJson,parseString,stringToArr,jsonToString } from '/monkeyMap.js';

let wsOpen = false;

const flag = true;

const hostUrl = 'localhost:4200';
let monk = null;

const canv = document.getElementById('canv');
let scene = new Scene();
let ctx = canv.getContext('2d');

const ws = new WebSocket(`ws://${hostUrl}`);
ws.addEventListener('open',(e)=>{
    wsOpen = true;
    console.log(`Connection established: ${e.data}`);
    ws.send('gimme');
});
ws.addEventListener('close',(e)=>{
    wsOpen = false;
    window.alert('connection to websocket closed');
    console.log(`Connection closed: ${e.data}`);
});
ws.addEventListener('message',(e)=>{
    //console.log(`Received a message from the server: ${e.data}`);
    const ass = JSON.parse(e.data);
    if(ass.monkeys != null && ass.monkeys != ''){
        const monks = stringToMap(parseString(ass.monkeys));
        for(const j of monks.keys()){
            const arr = stringToArr(j);
            if(arr[0] != monk.id){
                if(scene.actors.has(Number(arr[0]))){
                    if(stringToJson(scene.actors.get(Number(arr[0]))).trans.inp[0] != arr[4] && stringToJson(scene.actors.get(Number(arr[0]))).trans.inp[1] != arr[5]){
                        scene.actors.set(Number(arr[0]),monks.get(j));
                    }
                }
                else{
                    scene.actors.set(Number(arr[0]),monks.get(j));
                }
            }
        }
        //logActors();
    }
    else if(ass.assignment != null){
        monk = new MonKey(ass.assignment);
        spawn(monk,new Transform(canv.offsetWidth/2,canv.offsetHeight/2));
        console.log('player assigned');
    }
    else if(ass.disconnect != null){
        scene.actors.delete(ass.disconnect);
    }
    else if(ass.connection != null){
        console.log('A new user connected');
        if(ass.connection != monk.id){
            sendMonk();
        }
        document.getElementById('users').innerText = `Users: ${scene.actors.size}`;
    }
});

window.addEventListener('keydown', (e) =>{
    monk.moveD(addMove(e));
});

window.addEventListener('keyup',(e)=>{
    monk.moveU(removeMove(e));
});

canv.addEventListener('click',(e)=>{
    const canvCoords = [e.pageX-canv.offsetLeft-canv.clientLeft,e.pageY-canv.offsetLeft-canv.clientLeft];
    monk.trans.setDest(canvCoords[0],canvCoords[1]);
    monk.translate();
    sendMonk();
});

const update = window.setInterval(() => {
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    for(const v of scene.actors.keys()){
        if(Number(v) != monk.id){
            const actor = stringToJson(scene.actors.get(Number(v)));
            actor.trans.translate2();
            scene.actors.set(Number(v),jsonToString(actor));
            const pos = [actor.trans.x,actor.trans.y];
            const img = new Image();
            img.src = actor.sprite;
            ctx.drawImage(img,pos[0]-img.offsetWidth/2,pos[1]-img.offsetHeight/2);
        }
        else{
            monk.trans.translate2();
            const pos = [monk.trans.x,monk.trans.y];
            const img = new Image();
            img.src = monk.getSprite();
            ctx.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
        }
    }
    document.getElementById('users').innerText = `Users: ${scene.actors.size}`;
},42);

/*
const gei = window.setInterval(()=>{
    if(wsOpen && scene.actors.size > 0){
        const packet = objToString(monk);
        ws.send(JSON.stringify(packet));
    }
},1000);

const dei = window.setInterval(()=>{
    if(wsOpen){
        ws.send('gimme');
    }
},1000);
*/

function spawn(m,t){
    m.trans = t;
    m.trans.setDest(m.trans.x,m.trans.y);
    scene.actors.set(Number(m.id),objToString(m));
}

function sendMonk(){
    if(wsOpen && scene.actors.size > 0){
        const packet = objToString(monk);
        ws.send(JSON.stringify(packet));
    }
}

function logActors(){
    for(const k of scene.actors.keys()){
        console.log(k);
    }
}