const fs = require('fs');
const PNG = require('pngjs').PNG;

const files = [
    'media__1771746034214.png',
    'media__1771746028733.png'
];

files.forEach(f => {
    const path = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\44c46d08-ba03-4f6f-b2d9-7ec8be6a41c4\\' + f;

    fs.createReadStream(path)
        .pipe(new PNG())
        .on('parsed', function () {
            let r = 0, g = 0, b = 0, count = 0;
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    const idx = (this.width * y + x) << 2;
                    const alpha = this.data[idx + 3];
                    // Only consider non-transparent pixels
                    if (alpha > 128) {
                        r += this.data[idx];
                        g += this.data[idx + 1];
                        b += this.data[idx + 2];
                        count++;
                    }
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                console.log(`File: ${f}, Image Dims: ${this.width}x${this.height}, Avg Color: rgb(${r}, ${g}, ${b})`);

                // Heuristic check
                if (r > 200 && g < 150 && b < 100) {
                    console.log(`=> This looks like SHOPEE (Orange/Red dominant)`);
                } else if (r < 100 && g < 100 && b < 100) {
                    console.log(`=> This looks like TIKTOK (Black dominant)`);
                } else {
                    console.log(`=> UNKNOWN DOMINANT COLOR`);
                }
            } else {
                console.log(`File: ${f} is completely transparent?`);
            }
        })
        .on('error', err => {
            console.error('Error parsing', f, err);
        });
});
