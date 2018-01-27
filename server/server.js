const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const socket = require('socket.io')(server);
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');

const IO = require('./io');
const ra = new IO({
    en: 22,
    pul: 24,
    dir: 26
});
ra.setCyclesPerDay(0);
const dec = new IO({
    en: 8,
    pul: 10,
    dir: 12
});
dec.setCyclesPerDay(0);

app.use(static(path.resolve(__dirname, 'build')));
app.use(bodyParser());
app.use(ctx=>{
    const data = ctx.request.body;
    ctx.body = false;
    if (data.ra) {
        ra.setCyclesPerDay(data.ra);
        ctx.body = true;
    }
    if (data.dec) {
        dec.setCyclesPerDay(data.dec);
        ctx.body = true;
    }
});

server.listen(7001);
