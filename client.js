// const fs = require('fs');
// const file = fs.createWriteStream('./myNewFile.txt');
process.stdin.setEncoding('utf8');
const net = require('net')

const client = net.createConnection({ port: 6000 }, () => {
    console.log('connected')
    console.log()
})
process.stdin.on('data', (data) => {
    client.write(data)
})
client.on('data', (data) => {
    if(data.toString().trimEnd()=='kick'){
        client.end()
    }
    else{
    console.log(data.toString());
    }
});
client.on('end', () => {
    console.log('End of Message');
});