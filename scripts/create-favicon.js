const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'logo.png');
const outputPath = path.join(__dirname, 'public', 'favicon.ico');
const appIconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

pngToIco(inputPath)
    .then((buf) => {
        fs.writeFileSync(outputPath, buf);
        fs.writeFileSync(appIconPath, buf);
        console.log('Favicon created successfully!');
    })
    .catch((err) => {
        console.error('Error:', err);
    });
