const port = 4200;

const server = Bun.serve({
    port: port,
    fetch(req,serv){
        const ip = serv.requestIP(req);
        const yurl = new URL(req.url);
        console.log(ip);
        console.log(`client is requesting: ${yurl.pathname}`);
        console.log(`listening on port: ${serv.port}`);
        return new Response('404');
    },
    static: {
        '/favicon.ico': new Response(await Bun.file('./images/flower1.png').bytes(),
        {headers: {'Content-Type': 'img/png'},}),
        '/game.html': new Response(await Bun.file('./index.html').bytes(),
        {headers: {'Content-Type': 'text/html' },}),
        '/game.js': new Response(await Bun.file('./game.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/monKey.js': new Response(await Bun.file('./monKey.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/transform.js': new Response(await Bun.file('./transform.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/inventory.js': new Response(await Bun.file('./inventory.js').bytes(),
        {headers: {'Content-Type': 'text/javascript'},}),
        '/style.css': new Response(await Bun.file('./style.css').bytes(),
        {headers: {'Content-Type': 'text/css'},}),
        '/images/alien.png': new Response(await Bun.file('./images/alien.png').bytes(),
        {headers: {'Content-Type': 'image/png'},}),
        '/': new Response('LFG'),
    },
});