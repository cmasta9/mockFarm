const port = 4200;
import {mapToString,MstringToJson,MjsonToString,parseString,stringToArr} from './monkeyMap.js';
let monkeys = new Map();
let plants = new Map();

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
        '/plant.js': new Response(await Bun.file('./plant.js').bytes(),
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
        '/inputCanv.js': new Response(await Bun.file('./inputCanv.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/style.css': new Response(await Bun.file('./style.css').bytes(),
        {headers: {'Content-Type': 'text/css'},}),
        '/images/alien.png': new Response(await Bun.file('./images/alien.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/images/alienL.png': new Response(await Bun.file('./images/alienL.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/images/flower1.png': new Response(await Bun.file('./images/flower1.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/images/seedling.png': new Response(await Bun.file('./images/seedling.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/': new Response('LFG'),
    },
    websocket: {
        async open(ws){
            ws.send(JSON.stringify({'assignment': ws.data.socketId}));
            console.log(`Sent wsID to ${ws.data.socketId}`);
            ws.subscribe('game');
            server.publish('game',JSON.stringify({'connection': ws.data.socketId}));
        },
        async close(ws){
            console.log(`${ws.data.socketId} disconnected`);
            server.publish('game',JSON.stringify({'disconnect': ws.data.socketId}));
            monkeys.delete(ws.data.socketId);
        },
        async message(ws,mess){
            //console.log(`Received a message: ${JSON.stringify(mess)} from ${ws.data.socketId}`);
            if(mess == 'gimme'){
                ws.send(JSON.stringify({'monkeys': mapToString(monkeys),'plants': mapToString(plants)}));
                console.log(`Sent scene data to ${ws.data.socketId}`);
                return;
            }
            else if(JSON.parse(mess).plant != null){
                const plant = stringToArr(JSON.parse(mess).plant);
                const newPlant = `${plant[0]},${plant[1]},${plant[2]},${Number(Date.now())+Number(plant[3])*1000}`;
                console.log(`Received a request to plant a seed at: ${plant[0]},${plant[1]} from ${ws.data.socketId}, ${JSON.parse(mess).monkey}`);
                if(!plants.has(`${plant[0]},${plant[1]}`)){
                    plants.set(`${plant[0]},${plant[1]}`,newPlant);
                    console.log(newPlant);
                    server.publish('game',JSON.stringify({'planted':newPlant,'monkey':ws.data.socketId}));
                    console.log(`Request granted, ${plants.size}`);
                }else{
                    
                }
                return;
            }
            else if(JSON.parse(mess).pick != null){
                const plantQ = stringToArr(JSON.parse(mess).pick);
                const plantR = plants.get(`${plantQ[0]},${plantQ[1]}`);
                if(plantR){
                    const arr = stringToArr(plantR);
                    if(Number(Date.now()) >= Number(arr[3])){
                        plants.delete(`${plantQ[0]},${plantQ[1]}`);
                        server.publish('game',JSON.stringify({'picked':`${plantQ[0]},${plantQ[1]}`,'picker':ws.data.socketId}));
                        console.log(`${ws.data.socketId} picked a plant at ${plantQ[0]},${plantQ[1]}... ${plants.size}`);
                    }else{
                        console.log(`${ws.data.socketId} tried to pick a plant at ${plantQ[0]},${plantQ[1]}, but it is not mature yet`);
                    }
                }else{
                    console.log(`${ws.data.socketId} tried to pick a plant at ${plantQ[0]},${plantQ[1]} that doesn't exist`);
                }
                return;
            }
            else{
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