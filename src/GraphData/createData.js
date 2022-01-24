var fs = require('fs');
kp = {}

po = 1637929912
ut = 78
console.log(Math.floor(Math.random() * 100)/10)
for (let index = 0; index < 100; index++) {
    
    tsn = po + 86400 + Math.floor(Math.random() * 100)
    rn = (Math.floor(Math.random() * 100)/10)*2
    kp[tsn.toString()] = ut+rn
    po = tsn
    
}

console.log(kp)
fs.writeFile('data.json', JSON.stringify(kp),function(err) {
    if (err) throw err;
    console.log('complete');
    });