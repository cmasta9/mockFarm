export class Inventory{
    constructor(fruit=0,seeds=6,fertilizer=0){
        this.fruit = fruit;
        this.seeds = seeds;
        this.fertilizer = fertilizer;
    }

    getBans(){
        return this.fruit;
    }
}