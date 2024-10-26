import {MonKey} from '/monKey.js';
import {Transform} from '/transform.js';
import {Plant} from '/plant.js';
import {Scene} from '/scene.js';
import {setPos,openMenu} from '/inputCanv.js';
import { objToString,objToJson,stringToMap,stringToJson,parseString,stringToArr,jsonToString } from '/monkeyMap.js';

const flowerPath = '/images/flower1.png';
const pImg = new Image();
pImg.src = flowerPath;

let wsOpen = false;

const hostUrl = 'localhost:4200';
let monk = null;

const canv = document.getElementById('canv');
const pCanv = document.getElementById('plant');
const iCanv = document.getElementById('ui');
const buttColor = iCanv.style.backgroundColor;
let scene = new Scene();
let ctx = canv.getContext('2d');
let ctxp = pCanv.getContext('2d');
let ctx2 = iCanv.getContext('2d');
ctx2.font = '42px Arial';
setPos(iCanv,canv.offsetWidth*0.1,canv.offsetHeight*0.8);

document.getElementById('users').style.top = `${canv.offsetHeight + 42}px`;

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
    toggleMouseover(iCanv);
    setSeedText();
});

iCanv.addEventListener('mouseout',() =>{
    toggleMouseover(iCanv);
    setSeedText();
});

function setSeedText(){
    ctx2.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    ctx2.font = '42px Arial';
    if(iCanv.classList.contains('mouseOn')){
        ctx2.fillText('Plant',iCanv.offsetWidth,iCanv.offsetHeight);
    }else{
        ctx2.fillText(`${monk.inv.seeds}`,iCanv.offsetWidth,iCanv.offsetHeight);
    }
}

function toggleMouseover(e){
    if(e.classList.contains('mouseOn')){
        e.classList.remove('mouseOn');
    }else{
        e.classList.add('mouseOn');
    }
}

iCanv.addEventListener('click',() =>{
    if(monk.inv.seeds > 0 && plant()){
        monk.inv.seeds--;
        clickButton('#eeeeee',0.5);
    }else{
        clickButton('#aa0000',0.5);
    }
});

canv.addEventListener('click',(e)=>{
    const canvCoords = [e.pageX-canv.offsetLeft-canv.clientLeft,e.pageY-canv.offsetLeft-canv.clientLeft];
    const plantKey = plantCollision(canvCoords,pImg.naturalWidth);
    if(plantKey && plantCollision(monk.getPos(),pImg.naturalWidth) == plantKey){
        console.log('clicked on a plant');
        if(scene.plants.get(plantKey).mature()){
            console.log('plant is mature');
            pickPlant(plantKey);
        }else{
            console.log('not mature yet');
        }
    }else{
        monk.trans.setDest(canvCoords[0],canvCoords[1]);
        monk.translate();
        sendMonk();
    }
});

const update = setInterval(() => {
    setPlants();
    ctx.clearRect(0,0,canv.offsetWidth,canv.offsetHeight);
    updateActors();
    document.getElementById('users').innerText = `Users: ${scene.actors.size}`;
},42);

function spawn(m,t){
    m.trans = t;
    m.trans.setDest(m.getPos());
    scene.actors.set(Number(m.id),objToString(m));
    ctx2.fillText(m.inv.seeds,iCanv.offsetWidth,iCanv.offsetHeight);
}

function plant(){
    let coords = monk.getPos();
    if(monk.spriter.getFace()){
        coords[0] += 20;
    }else{
        coords[0] -= 20;
    }
    const key = `${coords[0]},${coords[1]}`;
    if(!scene.plants.has(key)){
        if(!plantCollision(coords,pImg.naturalWidth)){
            const plant = new Plant();
            scene.plants.set(key,plant);
            console.log(`Seed planted at ${key}`);
            return true;
        }
    }
    return false;
}

function pickPlant(k){
    const plant = scene.plants.get(k);
    const pos = k.split(',');
    if(plant){
        console.log
        scene.plants.delete(k);
        ctxp.clearRect(pos[0]-pImg.naturalWidth/2,pos[1]-pImg.naturalHeight/2,pImg.naturalWidth,pImg.naturalHeight);
        monk.inv.fruit += plant.getFruit();
        monk.inv.seeds += plant.getSeeds();
        console.log(`new fruit: ${monk.inv.fruit}`);
        setSeedText();
    }
}

function updateActors(){
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
            const pos = monk.getPos();
            const img = new Image();
            img.src = monk.getSprite();
            ctx.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
        }
    }
}

function setPlants(){
    for (const k of scene.plants.keys()){
        const pos = k.split(',');
        const plant = scene.plants.get(k);
        if(!plant.mature()){
            // allowing more than one frame for this to occur ensures that it will happen every time -- resource loading lag?
            if(plant.view < 3){
                plant.viewSet();
                const img = new Image();
                img.src = plant.sprite;
                ctxp.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
                plant.view++;
                //console.log(`${k} placed`);
            }
        }
        else{
            if(plant.view < 3){
                plant.viewSet();
                const img = new Image();
                img.src = plant.sprite;
                ctxp.drawImage(img,pos[0]-img.naturalWidth/2,pos[1]-img.naturalHeight/2);
                plant.view++;
                //console.log(`${k} matured`);
            }
        }
    }
}

function collision1D(q1,q2,r){
    if(Math.abs(q1-q2) <= r){
        return true;
    }else{
        return false;
    }
}

function distance(q1,q2){
    return Math.sqrt(Math.pow(q1[0]-q2[0],2)+Math.pow(q1[1]-q2[1],2));
}

function collision2D(q1,q2,r){
    //console.log(q1,q2,r);
    if(distance(q1,q2) <= r){
        return true;
    }else{
        return false;
    }
}

function plantCollision(q,r){
    let plants = [];
    for(const k of scene.plants.keys()){
        const q2 = k.split(',');
        if(collision2D(q,q2,r)){
            //console.log(`plant collision detected with ${k}`);
            plants.push(k);
        }
    }
    if(plants.length > 1){
        let closest = 0;
        for(let i = 1; i < plants.length; i++){
            if(distance(q,plants[i].split(',')) < distance(q,plants[closest].split(','))){
                //console.log(distance(q,plants[i].split(',')));
                closest = i;
            }
        }
        //console.log(distance(q,plants[closest].split(',')));
        return plants[closest];
    }else if(plants.length != 0){
        return plants[0];
    }
    else{
        return false;
    }
}

function sendMonk(){
    if(wsOpen && scene.actors.size > 0){
        const packet = objToString(monk);
        ws.send(JSON.stringify(packet));
    }
}

function clickButton(c,t){
    iCanv.style.backgroundColor = c;
    setTimeout(()=>{
        iCanv.style.backgroundColor = buttColor;
    },t*1000);
}

function logActors(){
    for(const k of scene.actors.keys()){
        console.log(k);
    }
}