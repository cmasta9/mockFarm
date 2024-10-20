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

    setTrans(x,y,spd=this.trans.getSpd()){
        console.log(x,y,spd);
        this.trans = new Transform(x,y,spd);
        console.log(self.trans.getX());
    }
}