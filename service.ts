const port = 4200;
import {mapToString,stringToJson,jsonToString} from './monkeyMap.js';
let monkeys = new Map();

const server = Bun.serve<{ socketId : number }>({
    port: port,
    fetch(req,serv){
        const success = serv.upgrade(req, {data: {socketId: Date.now(),}});
        if(success){
            return undefined;
        }
        const ip = serv.requestIP(req);
        const yurl = new URL(req.url);
        console.log(`${JSON.stringify(ip)} is requesting: ${yurl.pathname}`);
        return new Response('404');
    },
    static: {
        '/favicon.ico': new Response(await Bun.file('./images/flower1.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/game.html': new Response(await Bun.file('./index.html').bytes(),
        {headers: {'Content-Type': 'text/html'},}),
        '/game.js': new Response(await Bun.file('./game.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/user.js': new Response(await Bun.file('./user.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/monKey.js': new Response(await Bun.file('./monKey.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/transform.js': new Response(await Bun.file('./transform.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/spriter.js': new Response(await Bun.file('./spriter.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/inventory.js': new Response(await Bun.file('./inventory.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/input.js': new Response(await Bun.file('./input.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/scene.js': new Response(await Bun.file('./scene.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/monkeyMap.js': new Response(await Bun.file('./monkeyMap.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/style.css': new Response(await Bun.file('./style.css').bytes(),
        {headers: {'Content-Type': 'text/css'},}),
        '/images/alien.png': new Response(await Bun.file('./images/alien.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/images/alienL.png': new Response(await Bun.file('./images/alienL.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/': new Response('LFG'),
    },
    websocket: {
        async message(ws,mess){
            //console.log(`Received a message: ${JSON.stringify(mess)} from ${ws.data.socketId}`);
            //console.log(mess);
            if(mess == 'Assignment'){
                ws.send(JSON.stringify({'assignment': ws.data.socketId}));
                console.log(`Assigned an ID to ${ws.data.socketId}`);
            }
            else if(mess == 'gimme'){
                if(monkeys.size > 1){
                    //console.log(`size: ${monkeys.size}, ${mapToString(monkeys)}`);
                    ws.send(JSON.stringify({'monkeys': mapToString(monkeys)}));
                    console.log(`Sent monkey (${monkeys.size}) datas to ${ws.data.socketId}`);
                }
            }
            else{
                try{
                    const jason = stringToJson(mess);
                    if(jason.id){
                        monkeys.set(jason.id,jsonToString(jason));
                        console.log(`Logged data from ${jason.id}, ${monkeys.get(jason.id)}`);
                    }
                }
                catch(e){
                    console.log(`error handling message: ${JSON.stringify(mess)}, ${e}`);
                }
            }
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);