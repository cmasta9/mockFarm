const seedling = '/images/seedling.png';
const flower = '/images/flower1.png';

export class Plant{
    constructor(loc=[0,0],id=Date.now(),maturityTime=Date.now()+10000,fruitProb=1,maxFruit=1,seedProb=0.2,maxSeed=4,sprite=seedling,view=0){
        this.loc = loc;
        this.id = id;
        this.maturityTime = maturityTime;
        this.fruitProb = fruitProb;
        this.maxFruit = maxFruit;
        this.seedProb = seedProb;
        this.maxSeed = maxSeed;
        this.sprite = sprite;
        this.view = view;

        if(Number(Date.now()) >= this.maturityTime){
            this.sprite = flower;
        }else{
            this.int = setInterval(()=>{
                if(Number(Date.now()) >= this.maturityTime){
                    this.sprite = flower;
                    this.view = 0;
                    clearInterval(this.int);
                }else{
                    this.sprite = seedling;
                }
            },1000);
        }
    }

    getSeeds(){
        let seeds = 0;
        for(let i = 0; i < this.maxSeed; i++){
            if(Math.random() < this.seedProb){
                seeds++;
            }
        }
        return seeds;
    }

    getFruit(){
        let fruit = 0;
        for(let i = 0; i < this.maxFruit; i++){
            if(Math.random() < this.fruitProb){
                fruit++;
            }
        }
        return fruit;
    }

    mature(){
        if(this.sprite == flower){
            return true;
        }else{
            return false;
        }
    }

    viewSet(){
        if(Number(Date.now()) < this.maturityTime){
            this.sprite = seedling;
        }else{
            this.sprite = flower;
        }
        //console.log(this.sprite);
    }
}