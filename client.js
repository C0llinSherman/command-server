// const fs = require('fs');
// const file = fs.createWriteStream('./myNewFile.txt');
process.stdin.setEncoding('utf8');
const net = require('net')

const client = net.createConnection({ port: 6000 }, () => {
    console.log('connected')
    console.log()
})
process.stdin.on('data', (data) => {
    let dataArray = data.split(" ")
    
    if(dataArray[0].toString().trimEnd() == '/w'){
        console.log("whisper")
        client.write(dataArray.toString())
        client.write("whisper")
    }
    else if(dataArray[0].toString().trimEnd() == '/username'){
        console.log("username")
        client.write(dataArray)
    }
    else if(dataArray[0].toString().trimEnd() == '/kick'){
        console.log("kick")
        client.write(dataArray)
    }
    else if(dataArray[0].toString().trimEnd() == '/clientlist'){
        console.log("clientlist")
        client.write(dataArray)
    }
    else{client.write(data)}
})
client.on('data', (data) => {
    console.log(data.toString());
});
client.on('end', () => {
    console.log('End of Message');
});