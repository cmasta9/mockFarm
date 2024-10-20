export class Transform{
    constructor(x=0,y=0,inp=[0,0],spd=2){
        this.x = Number(x);
        this.y = Number(y);
        this.inp = inp;
        this.spd = spd;
    }

    setX(x){
        this.x = x;
    }

    getX(){
        return this.x;
    }

    setY(y){
        this.y = y;
    }

    getY(){
        return this.y;
    }

    setSpd(spd){
        this.spd = spd;
    }

    getSpd(){
        return this.spd;
    }

    translate(){
        if(this.inp.length > 1){
            this.x += this.spd * this.inp[0];
            this.y += this.spd * this.inp[1];
        }
    }
}