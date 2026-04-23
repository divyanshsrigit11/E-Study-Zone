const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cluster = require('cluster');
const os = require('os');
const MongoDB = require('./config/db');

dotenv.config();

if (cluster.isPrimary) {
    const numCores = os.availableParallelism();
    console.log(`Master process is running. Forking ${numCores} workers...`);

    for (let i = 0; i < numCores; i++) {
        cluster.fork();
    }

    cluster.on('fork', (worker) => {
        console.log(`Worker ${worker.process.pid} is forked`);
    });

    // CRITICAL ADDITION: Auto-restart workers if they crash!
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork(); 
    });

} else {
    // Everything in this block runs on multiple CPU cores simultaneously
    const app = express();
    app.use(cors({
        origin: ['http://localhost:5173', 'here'], // Add Vercel URL, must remember!!
        credentials: true
    }));
    app.use(express.json());
    
    MongoDB();

    // ==========================================
    // API ROUTES
    // ==========================================
    app.use('/api/user', require('./routes/userRoute'));
    app.use('/api/admin', require('./routes/adminRoute'));
    app.use('/api/password', require('./routes/passwordRoute'));
    
    // For local multer uploads
    app.use('/uploads', express.static('uploads'));

    app.listen(process.env.PORT, () => {
        console.log(`Server worker started at Port ${process.env.PORT}`);
    });
}