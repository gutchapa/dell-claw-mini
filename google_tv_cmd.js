const { AndroidRemote } = require('androidtv-remote');
const fs = require('fs');

const host = '192.168.1.21'; 
const cert = JSON.parse(fs.readFileSync('google_tv_cert.json', 'utf8'));

const options = {
    pairing_port: 6467,
    remote_port: 6466,
    name: 'OpenClaw API',
    cert: cert 
};

const remote = new AndroidRemote(host, options);

remote.on('ready', () => {
    // 3 = SHORT
    try {
        remote.sendKey(164, 3);
        console.log("Muted Google TV");
        setTimeout(() => process.exit(0), 500);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
});

remote.on('error', (err) => {
    console.error('Connection error:', err);
    process.exit(1);
});

remote.start().catch(console.error);
