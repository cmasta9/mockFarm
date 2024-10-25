export class Inventory{
    constructor(bananas=0,seeds=6,fertilizer=0){
        this.bananas = bananas;
        this.seeds = seeds;
        this.fertilizer = fertilizer;
    }

    getBans(){
        return this.bananas;
    }
}