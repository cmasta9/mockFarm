const flowerPath = '/images/flower1.png';
const menuSizeRel = 0.8;

export class InputCanvas{
    constructor(canv,abilities=['plant']){
        this.canv = canv;
        this.abilities = abilities;
    }   
}

export function setPos(c,x,y){
    console.log(x,y);
    c.style.left = x + 'px';
    c.style.top = y + 'px';
}

export function openMenu(cPar){
    let cCh = document.getElementById('inp');
    console.log(cCh.style.width);
    for(let w = parseInt(cCh.style.width); w < (cPar.offsetWidth*0.8)-parseInt(cCh.style.left); w += 2){
        cCh.style.width = w + 'px';
        console.log(cCh.style.width);
    }
    console.log(cCh.offsetWidth,cCh.style.width,cPar.offsetWidth);
    console.log('open');
}