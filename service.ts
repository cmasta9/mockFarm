const port = 4200;
import {mapToString,stringToJson,jsonToString,parseString,stringToArr} from './monkeyMap.js';
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
        async open(ws){
            ws.send(JSON.stringify({'assignment': ws.data.socketId}));
            console.log(`Sent wsID to ${ws.data.socketId}`);
            ws.subscribe('game');
            server.publish('game',JSON.stringify({'connection': ws.data.socketId}));

            /*
            setInterval(() => {
                if(monkeys.size > 1){
                    ws.send(JSON.stringify({'monkeys': mapToString(monkeys)}));
                    console.log(`Sent monkey (${monkeys.size}) datas to ${ws.data.socketId}`);
                }
            }, 500);
            */
        },
        async close(ws){
            console.log(`${ws.data.socketId} disconnected`);
            server.publish('game',JSON.stringify({'disconnect': ws.data.socketId}));
            monkeys.delete(ws.data.socketId);
        },
        async message(ws,mess){
            //console.log(`Received a message: ${JSON.stringify(mess)} from ${ws.data.socketId}`);
            if(mess == 'gimme'){
                ws.send(JSON.stringify({'monkeys': mapToString(monkeys)}));
                console.log(`Sent monkey data to ${ws.data.socketId}`);
            }else{
                try{
                    const stir = stringToArr(parseString(mess));
                    if(stir[0]){
                        monkeys.set(Number(stir[0]),parseString(mess));
                        console.log(`Logged data from ${stir[0]}, ${monkeys.get(Number(stir[0]))}`);
                        if(monkeys.size > 1){
                            server.publish('game',JSON.stringify({'monkeys': mapToString(monkeys)}));
                            console.log(`Broadcasted (${monkeys.size}) monKey datas`);
                        }
                    }
                }
                catch(e){
                    console.log(`error handling server message: ${JSON.stringify(mess)}, ${e}`);
                }
            }
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);