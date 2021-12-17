const net = require("net")
const { ClientRequest } = require("http");
const fs = require('fs');
const fileName = './myNewFile.txt'
const clients = []
let count = 0

const server = net.createServer((client) => {
    client.write("Welcome to the chat room!")
    client.id = ++count
    clients.push(client)
    clients.forEach(currClient => {
        if (currClient.id !== client.id) {
            currClient.write(`Client ${client.id} joined the chat`);
        }
        else if (currClient.id === client.id) {
            let message = `Client ${client.id} joined the chat\n`
            fs.appendFile(fileName, message, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
    client.on('data', (data) => {
        clients.forEach(currClient => {
            if (currClient.id !== client.id) {
                currClient.write(`Client ${client.id}:  ${data}`);
            }
            else if (currClient.id === client.id) {
                let message = `Client ${client.id}:  ${data}`
                fs.appendFile(fileName, message, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        })
        console.log("Msg from client:" + data.toString());
    });
    client.on("end", () => {
        console.log('client disconnected')
        clients.forEach(currClient => {
            currClient.write(`Client ${client.id} disconnected`)
        })
        let message = `Client ${client.id} disconnected\n`
        fs.appendFile(fileName, message, (err) => {
            if (err) {
                console.log(err);
            }

        })
    })
}).listen(6000)
server.on('data', (data) => {
    console.log(clients)
    console.log(data)
})
console.log('server started')