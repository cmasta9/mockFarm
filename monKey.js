import {Transform} from './transform.js';
import {Inventory} from './inventory.js';

export class MonKey {
    constructor(id=Date.now(),trans=new Transform(),inv=new Inventory(),name='MonKey',level=1,elem='Earth'){
        this.id = id;
        this.trans = trans;
        this.name = name;
        this.level = level;
        this.inv = inv;
        this.elem = elem;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getTrans(){
        return this.trans;
    }

    setTrans(x=0,y=0,i=[],spd=this.trans.spd){
        this.trans = new Transform(x,y,i,spd);
    }
}