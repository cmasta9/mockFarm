import {Transform} from '/transform.js';
import {Inventory} from '/inventory.js';
import {Spriter} from '/spriter.js';

export class MonKey {
    constructor(id=Date.now(),trans=new Transform(),inv=new Inventory(),spriter=new Spriter(),name='MonKey',level=1,elem=null){
        this.id = id;
        this.trans = trans;
        this.spriter = spriter;
        this.inv = inv;

        this.name = name;
        this.level = level;
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

    getSprite(){
        return this.spriter.cur;
    }

    moveD(i){
        if(i[0] > 0){
            this.spriter.faceRt();
        }else if(i[0] < 0){
            this.spriter.faceLt();
        }
        this.moveU(i);
    }

    moveU(i){
        this.trans.inp = i;
        this.trans.translate();
    }

    setTrans(x=0,y=0,i=[],spd=this.trans.spd){
        this.trans = new Transform(x,y,i,spd);
    }
}