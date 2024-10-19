import {Transform} from './transform.js';
import {Inventory} from './inventory.js';

export class MonKey {
    constructor(id=Date.now(),trans=new Transform(),inv=new Inventory(),name='MonKey',level=1,elem='Earth'){
        self.id = id;
        self.trans = trans;
        self.name = name;
        self.level = level;
        self.inv = inv;
        self.elem = elem;
    }

    getId(){
        return self.id;
    }

    getName(){
        return self.name;
    }

    getTrans(){
        return self.trans;
    }

    setTrans(x,y,spd){
        console.log(x,y,spd);
        self.trans = new Transform(x,y,spd);
        console.log(self.trans.getX());
    }
}