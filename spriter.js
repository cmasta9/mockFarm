const alienPath = '/images/alien.png';
const alienPathL = '/images/alienL.png';

export class Spriter{
    constructor(right=alienPath,left=alienPathL){
        this.right = right;
        this.left = left;
        this.faceRt();
        console.log(this.cur);
    }

    faceRt(){
        this.cur = this.right;
    }

    faceLt(){
        this.cur = this.left;
    }
}