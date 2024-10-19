export class Inventory{
    constructor(bananas=0,seeds=0,fertilizer=0){
        self.bananas = bananas;
        self.seeds = seeds;
        self.fertilizer = fertilizer;
    }

    getBans(){
        return self.bananas;
    }
}