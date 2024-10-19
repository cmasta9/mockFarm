export class Transform{
    constructor(x=0,y=0,spd=5){
        self.x = Number(x);
        self.y = Number(y);
        self.spd = spd;
    }

    setX(x){
        self.x = x;
    }

    getX(){
        return self.x;
    }

    setY(y){
        self.y = y;
    }

    getY(){
        return self.y;
    }

    setSpd(spd){
        self.spd = spd;
    }

    getSpd(){
        return self.spd;
    }

    translate(x=0,y=0){
        self.x += x * self.spd;
        self.y += y * self.spd;
    }
}