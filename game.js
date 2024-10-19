main();

function main(){
    const canv = document.getElementById('glcanv');
    const gl = canv.getContext('webgl');

    if(gl == null){
        window.alert('cannot contextualize webgl');
        return;
    }

    gl.clearColor(0,0,0.42,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}