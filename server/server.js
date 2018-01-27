const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);


app.use(ctx=>{
    ctx.body = "Hello, world";
});

server.listen(7001);