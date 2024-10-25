import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';
import {Plant} from '/plant.js';
import {Scene} from '/scene.js';
import {setPos,openMenu} from '/inputCanv.js';
import { objToString,objToJson,stringToMap,stringToJson,parseString,stringToArr,jsonToString } from '/monkeyMap.js';

const flowerPath = '/images/flower1.png';

let wsOpen = false;

const hostUrl = 'localhost:4200';
let monk = null;

const canv = document.getElementById('canv');
const pCanv = document.getElementById('plant');
const iCanv = document.getElementById('ui');
let scene = new Scene();
let ctx = canv.getContext('2d');
let ctxp = pCanv.getContext('2d');
let ctx2 = iCanv.getContext('2d');
ctx2.font = '42px Arial';
ctx2.fillText('Plant',iCanv.offsetWidth,iCanv.offsetHeight);
setPos(iCanv,canv.offsetWidth*0.1,canv.offsetHeight*0.8);

document.getElementById('users').style.top = canv.offsetHeight + 42 + 'px';

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

/*
window.addEventListener('keydown', (e) =>{
    monk.moveD(addMove(e));
});

window.addEventListener('keyup',(e)=>{
    monk.moveU(removeMove(e));
});
*/

iCanv.addEventListener('mouseover',() => {
    ctx2.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    iCanv.classList.add('open');
    ctx2.font = '42px Arial';
    ctx2.fillText('Plant',iCanv.offsetWidth,iCanv.offsetHeight);
});

iCanv.addEventListener('mouseout',() =>{
    ctx2.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    iCanv.classList.remove('open');
    ctx2.font = '42px Arial';
    ctx2.fillText(`${monk.inv.seeds}`,iCanv.offsetWidth,iCanv.offsetHeight);
});

iCanv.addEventListener('click',() =>{
    if(monk.inv.seeds > 0 && plant()){
        monk.inv.seeds--;
    }
});

canv.addEventListener('click',(e)=>{
    const canvCoords = [e.pageX-canv.offsetLeft-canv.clientLeft,e.pageY-canv.offsetLeft-canv.clientLeft];
    monk.trans.setDest(canvCoords[0],canvCoords[1]);
    monk.translate();
    sendMonk();
});

const update = setInterval(() => {
    setPlants();
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    for(const k of scene.actors.keys()){
        if(Number(k) != monk.id){
            const actor = stringToJson(scene.actors.get(Number(k)));
            actor.trans.translate2();
            scene.actors.set(Number(k),jsonToString(actor));
            const pos = [actor.trans.x,actor.trans.y];
            const img = new Image();
            img.src = actor.sprite;
            img.style.zIndex = 2;
            ctx.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
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

function plant(){
    let coords = [monk.trans.x,monk.trans.y];
    if(monk.spriter.getFace()){
        coords[0] += 20;
    }else{
        coords[0] -= 20;
    }
    const key = `${coords[0]},${coords[1]}`;
    if(!scene.plants.has(key)){
        const plant = new Plant();
        scene.plants.set(key,plant);
        console.log(`Seed planted at ${key}`);
        return true;
    }else{
        return false;
    }
}

function setPlants(){
    for (const k of scene.plants.keys()){
        const pos = k.split(',');
        const plant = scene.plants.get(k);
        if(!plant.mature()){
            if(plant.view < 5){
                plant.viewSet();
                const img = new Image();
                img.src = plant.sprite;
                console.log(pos);
                ctxp.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
                plant.view++;
                //console.log(`${k} placed`);
            }
        }
        else{
            if(plant.view < 5){
                const img = new Image();
                plant.viewSet();
                img.src = plant.sprite;
                ctxp.clearRect(pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2,img.naturalWidth,img.naturalHeight);
                ctxp.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
                plant.view++;
                //console.log(`${k} matured`);
            }
        }
    }
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