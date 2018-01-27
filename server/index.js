const IO = require('./io');

const io = new IO({
    en: 22,
    pul: 24,
    dir: 26
});

(async () => {
    await io.ready();
    await timeout(3000);
    for (let i = 0; 1 < 10; i ++) {
        io.setCyclesPerDay(i);
        await timeout(3000);
    }
    await io.close();
})();

function timeout(time) {
    return new Promise(fulfill => {
        setTimeout(fulfill, time);
    });
}