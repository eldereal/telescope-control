const fork = require('child_process').fork;
const path = require('path');

module.exports = class IO {
    
    constructor(config){
        this.process = fork(path.resolve(__dirname, 'io-client.js'), null, {
            stdio: 'inherit'
        });
        this.readyPromise = new Promise((fulfill, reject) => {
            const messageCallback = message => {
                if (message !== 'ready') {
                    reject(new Error('Invalid handshake message: ' + message));
                } else {
                    fulfill();
                }
                finish(this.process);
            }
            const errorCallback = err => {
                reject(err);
                finish(this.process);
            }
            const exitCallback = code => {
                reject(new Error('Unexpected child process exit: ' + code));
                finish(this.process);
            }
            function finish(process) {
                process.removeListener('message', messageCallback);
                process.removeListener('error', errorCallback);
                process.removeListener('exit', exitCallback);
            }            
            this.process.on('message', messageCallback);
            this.process.on('error', errorCallback);
            this.process.on('exit', exitCallback);
        });
        this.send({
            action: 'config',
            payload: config
        });
    }

    ready(){
        return this.readyPromise;
    }

    setCyclesPerDay(cycles) {
        return this.send({
            action: 'cycle',
            payload: Number(cycles)
        });
    }

    send(data) {
        return new Promise((fulfill, reject) => {
            this.process.send(data, err => {
                if (err) {
                    reject();
                } else {
                    fulfill();
                }
            });
        });        
    }

    close(){
        return new Promise((fulfill, reject) => {
            const timeout = setTimeout(() => {
                this.process.kill();
                fulfill();
            }, 3000);
            timeout.unref();
            this.process.once('exit', () => {
                clearTimeout(timeout);
                fulfill();
            });
            this.process.send({action:'close'});
        });
    }
}

