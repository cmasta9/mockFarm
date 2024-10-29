import { Transform } from './transform.js';
import { Plant } from './plant.js';

export function MobjToJson(m){
    return {'id': m.id,'sprite': m.getSprite(),'trans': m.trans};
}

export function MobjToString(m){
    return `${m.id},${m.getSprite()},${m.trans.x},${m.trans.y},${m.trans.inp[0]},${m.trans.inp[1]},${m.trans.spd}`;
}

export function PobjToString(p){
    return `${p.loc[0]},${p.loc[1]},${p.id},${p.maturityTime}`;
}

export function PstringToObj(s){
    const arr = stringToArr(s);
    return new Plant([arr[0],arr[1]],arr[2],arr[3]);
}

export function MjsonToString(j){
    return `${j.id},${j.sprite},${j.trans.x},${j.trans.y},${j.trans.inp[0]},${j.trans.inp[1]},${j.trans.spd}`;
}

export function MstringToJson(s){
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
        if(crunched != ''){
            crunched = crunched + ';';
        }
        crunched = crunched + map.get(k);
    }
    return crunched;
}

export function stringToMap(s){
    const arr = s.split(';');
    let map = new Map();
    for(let i = 0; i < arr.length; i++){
        map.set(arr[i].split(',')[0],arr[i]);
    }
    return map;
}