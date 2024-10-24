export class Transform{
    constructor(x=0,y=0,inp=[0,0],spd=5){
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

    setDest(x=0,y=0){
        this.inp = [x,y];
    }

    translate(){
        if(this.inp.length > 1){
            this.x += this.spd * this.inp[0];
            this.y += this.spd * this.inp[1];
        }
    }

    translate2(){
        const dist = Math.sqrt(Math.pow((this.inp[0] - this.x),2) + Math.pow((this.inp[1] - this.y),2));
        if(dist > this.spd){
            this.x = Math.round(this.x + (this.spd * (this.inp[0] - this.x)/dist));
            
            this.y = Math.round(this. y + (this.spd * (this.inp[1] - this.y)/dist));
            return true;
        }
        else{
            return false;
        }
    }
}