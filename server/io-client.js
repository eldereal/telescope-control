if (!process.send) {
    throw new Error('Parent process not present');
} else {
    process.send('ready');
}

process.on('message', message => {
    console.log('message', message);
    switch(message.action) {
        case 'close':
        process.exit();
        break;
    }    
});

process.on('close', () => {
    process.exit();
})


// function tick(){
//     return new Promise(fulfill => {
//         const time = process.hrtime();
//         setTimeout(() => {
//             const diff = process.hrtime(time);
//             const diffTime = diff[0] * 1000 + diff[1] / 1e6;
//             fulfill(diffTime);
//         });
//     });
// }


// const en = new Gpio(22);
// const pul = new Gpio(24);
// const dir = new Gpio(26);

// const reduction = 120 * 130;
// const steps = 360 / 7.5;
// const resolution = 1;

// en.open(Gpio.OUTPUT);
// en.write(Gpio.LOW);
// dir.open(Gpio.OUTPUT);
// dir.write(Gpio.HIGH);
// pul.open(Gpio.OUTPUT);
// pul.write(Gpio.LOW);


// const pulses = 86400 * 1000 / (reduction * steps * resolution * 2);

// console.log('pulse', pulses+'ms');

// while(true){
//     pul.toggle();
//     pul.sleep(pulses);
// }


// en.close();
// pul.close();
// dir.close();