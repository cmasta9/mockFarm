const maxIn = 4;

let inputX = 0;
let inputY = 0;

export function addMove(e){
    if(e.key == 'ArrowRight' && inputX < maxIn){
        inputX++;
    }
    if(e.key == 'ArrowLeft' && inputX > -maxIn){
        inputX--;
    }
    if(e.key == 'ArrowUp' && inputY > -maxIn){
        inputY--;
    }
    if(e.key == 'ArrowDown' && inputY < maxIn){
        inputY++;
    }
    return [inputX,inputY];
}

export function removeMove(e){
    if(e.key == 'ArrowRight' && inputX > 0){
        inputX = 0;
    }
    if(e.key == 'ArrowLeft' && inputX < 0){
        inputX = 0;
    }
    if(e.key == 'ArrowUp' && inputY < 0){
        inputY = 0;
    }
    if(e.key == 'ArrowDown' && inputY > 0){
        inputY = 0;
    }
    return [inputX,inputY];
}