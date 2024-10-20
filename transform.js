export class Transform{
    constructor(x=0,y=0,spd=5){
        this.x = Number(x);
        this.y = Number(y);
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

    translate(x=0,y=0){
        this.x += x * this.spd;
        this.y += y * this.spd;
    }
}