if (!process.send) {
    throw new Error('Parent process not present');
}

let toggleInterval;
let reduction, steps, resolution;
let en, pul, dir;
let enValue, dirValue;
let closed;

process.on('message', message => {
    console.log('message', message);
    switch(message.action) {
        case 'close':
            if (en) en.closed();
            if (pul) pul.closed();
            if (dir) dir.close();
            closed = true;
            break;
        case 'config':
            config(message.payload);
            break;
        case 'cycle': 
            setCyclesPerDay(message.payload);
            break;
    }    
});

function setCyclesPerDay(cyclesPerDay){
    cyclesPerDay = Number(cyclesPerDay);
    if (Number.isFinite(cyclesPerDay)) {
        if (Math.abs(cyclesPerDay) >= 1 && Math.abs(cyclesPerDay) <= 16) {
            toggleInterval = 86400 * 1000 / (cyclesPerDay * reduction * steps * resolution * 2);
        } else {
            toggleInterval = 0;
        }        
        if (!Number.isFinite(toggleInterval)) {
            toggleInterval = 0;
        }
    } else {
        toggleInterval = 0;
    }
}

let Gpio;

function config(c) {
    if (Gpio) {
        throw new Error('Alreay configured');
    }
    if (!c.en || !c.pul || !c.dir) {
        throw new Error('en, pul, dir is required in config');
    }
    Gpio = require('rpio2').Gpio;
    en = new Gpio(c.en);
    pul = new Gpio(c.pul);
    dir = new Gpio(c.dir);
    en.open(Gpio.OUTPUT);
    en.write(Gpio.LOW);
    enValue = Gpio.LOW;
    dir.open(Gpio.OUTPUT);
    dir.write(Gpio.HIGH);
    dirValue = Gpio.HIGH;
    pul.open(Gpio.OUTPUT);
    pul.write(Gpio.LOW);

    reduction = c.reduction || 120 * 130;
    steps = c.steps || 360 / 7.5;
    resolution = c.resolution || 1;

    setCyclesPerDay(0);

    loop().catch(e => {
        console.error('e');
        process.exit(1);
    });

    process.send('ready');
}

function tick(){
    return new Promise(fulfill => {
        const time = process.hrtime();
        setTimeout(() => {
            const diff = process.hrtime(time);
            const diffTime = diff[0] * 1000 + diff[1] / 1e6;
            fulfill(diffTime);
        });
    });
}


async function loop() {
    while (true) {
        if (toggleInterval > 0) {
            if (enValue !== Gpio.LOW) {
                en.write(enValue = Gpio.LOW);
            }
            if (dirValue !== Gpio.HIGH) {
                dir.write(dirValue = Gpio.HIGH);
            }
            pul.toggle();
        } else if (toggleInterval < 0) {
            if (enValue !== Gpio.LOW) {
                en.write(enValue = Gpio.LOW);
            }
            if (dirValue !== Gpio.LOW) {
                dir.write(dirValue = Gpio.LOW);
            }
            pul.toggle();
        } else {
            if (enValue !== Gpio.HIGH) {
                en.write(enValue = Gpio.HIGH);
            }
        }

        const time = await tick();
        if (time < toggleInterval) {
            pul.sleep(toggleInterval - time);
        } else if (toggleInterval === 0) {
            pul.sleep(100);
        }
    }
}