const IO = require('./io');

const io = new IO({});

(async () => {
    await io.ready();
    await io.send('hello');
    await io.close();
})();