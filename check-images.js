const fs = require('fs');

const files = [
    'media__1771746034214.png',
    'media__1771746028733.png',
    'media__1771746019184.png'
];

files.forEach(f => {
    try {
        const path = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\44c46d08-ba03-4f6f-b2d9-7ec8be6a41c4\\' + f;
        const fd = fs.openSync(path, 'r');
        const buffer = Buffer.alloc(24);
        fs.readSync(fd, buffer, 0, 24, 0);
        fs.closeSync(fd);

        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        console.log(`${f}: ${width}x${height}`);
    } catch (e) {
        console.error("Error reading", f);
    }
});
