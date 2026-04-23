// clusturing in nodeJS
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process is running. Forking ${numCPUs} workers...`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }   
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });
} else {
    require('./index'); // Assuming your server code is in index.js
}

console.log("This is the main thread");