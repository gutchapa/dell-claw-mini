const readline = require('readline');
const { AndroidRemote } = require('androidtv-remote');

const host = '192.168.1.22';
const options = {
    pairing_port: 6467,
    remote_port: 6466,
    name: 'OpenClaw API',
    cert: {} 
};

const remote = new AndroidRemote(host, options);

remote.on('secret', () => {
    console.log('[[WAITING_FOR_PIN]] The TV should be showing the 6-digit code right now.');
    console.log('Please enter the PIN below:');
});

remote.on('powered', (powered) => {
    console.log('Powered status:', powered);
});

remote.on('ready', () => {
    console.log('Success! Connected and ready.');
    console.log('Save this certificate for future connections:');
    console.log(JSON.stringify(remote.cert));
    
    // Save it to a file directly as well for the future
    const fs = require('fs');
    fs.writeFileSync('google_tv_cert.json', JSON.stringify(remote.cert, null, 2));
    console.log('Saved to google_tv_cert.json');
    
    process.exit(0);
});

remote.on('error', (err) => {
    console.error('Error:', err);
});

remote.start().then(() => {
    console.log('Started pairing request.');
}).catch(e => {
    console.error("Failed to start", e);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const pin = line.trim();
    if (pin.length > 0) {
        console.log(`Sending PIN: ${pin}`);
        try {
            remote.sendCode(pin);
        } catch (err) {
            console.error("Failed to authenticate:", err);
            process.exit(1);
        }
    }
});
