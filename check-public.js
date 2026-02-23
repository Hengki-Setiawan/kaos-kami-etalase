const fs = require('fs');

const publicFiles = fs.readdirSync('public').filter(f => f.endsWith('.png'));

publicFiles.forEach(f => {
    const path = 'public/' + f;
    const stats = fs.statSync(path);
    console.log(f, stats.size);
});
