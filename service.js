const port = 4200;

const server = Bun.serve({
    port: port,
    static: {
        '/game.html': new Response(await Bun.file('./game.html').bytes(),
        {headers: {'Content-Type': 'text/html' },}),
        '/': new Response('LFG'),
    },
    fetch(req,serv){
        const ip = serv.requestIP(req);
        return new Response(`Your IP address is ${JSON.stringify(ip)}`);
    },
});

console.log(`listening on port: ${port}`);