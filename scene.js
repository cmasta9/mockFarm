export class Scene{
    constructor(id=Date.now(),actors=new Map()){
        this.id = id;
        this.actors = actors;
    }
}