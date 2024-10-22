import { Transform } from './transform.js';

export function objToJson(m){
    return {'id': m.id,'sprite': m.getSprite(),'trans': m.trans};
}

export function objToString(m){
    return `${m.id},${m.getSprite()},${m.trans.x},${m.trans.y},${m.trans.inp[0]},${m.trans.inp[1]},${m.trans.spd}`;
}

export function jsonToString(j){
    return `${j.id},${j.sprite},${j.trans.x},${j.trans.y},${j.trans.inp[0]},${j.trans.inp[1]},${j.trans.spd}`;
}

export function stringToJson(s){
    const arr = s.split(',');
    return {'id': arr[0],'sprite': arr[1], 'trans': new Transform(arr[2],arr[3],[arr[4],arr[5]],arr[6])};
}

export function parseString(s){
    return s.trim().replaceAll('"','');
}

export function stringToArr(s){
    return s.split(',');
}

export function mapToString(map){
    let crunched = '';
    for(const k of map.keys()){
        //console.log(k);
        crunched = crunched + map.get(k) + ';';
    }
    return crunched;
}

export function stringToMap(s){
    const arr = s.split(';');
    let map = new Map();
    for(let i = 0; i < arr.length; i++){
        map.set(arr[i].split()[0],arr[i]);
    }
    return map;
}