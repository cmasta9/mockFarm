export class Scene{
    constructor(id=Date.now(),actors=new Map(),plants=new Map()){
        this.id = id;
        this.actors = actors;
        this.plants = plants;
    }
}