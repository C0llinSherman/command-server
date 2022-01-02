const net = require("net")
const { ClientRequest } = require("http");
const fs = require('fs');
const fileName = './myNewFile.txt'
const clients = []
let count = 0

const server = net.createServer((client) => {
    client.write("Welcome to the chat room!")
    client.id = `Guest${++count}`
    clients.push(client)
    clients.forEach(currClient => {
        if (currClient.id !== client.id) {
            currClient.write(`${client.id} joined the chat`);
        }
        else if (currClient.id === client.id) {
            let message = `${client.id} joined the chat\n`
            fs.appendFile(fileName, message, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
    client.on('data', (data) => {
        console.log(data.toString())
        //Command Logic
        let dataArray = data.toString().split(" ")
        console.log(dataArray)
        if (dataArray[0][0] == '/') {
            //Whisper
            if (dataArray[0].toString().trimEnd() == '/w' || dataArray[0].toString().trimEnd() == '/whisper') {
                let whisperMessage = ''
                for (let i = 2; i < dataArray.length; i++) {
                    whisperMessage += dataArray[i].toString().trimEnd()
                    whisperMessage += ' '
                }
                if (whisperMessage == '') {
                    client.write('command must include message')
                }
                else {
                    let clientExists = false
                    clients.forEach(currClient => {
                        if (currClient.id.toLowerCase() == dataArray[1].toString().toLowerCase().trimEnd()) {
                            currClient.write(`Whisper from ${client.id}: ` + whisperMessage)
                            clientExists == true
                        }
                    })
                    if (clientExists == false) {
                        client.write("Client does not exist")
                    }
                }
            }
            //Username
            else if (dataArray[0].toString().trimEnd() == '/username') {
                if (!dataArray[1]) {
                    client.write(`Current Username: ${client.id}`)
                }
                else {
                    let usernameTaken = false
                    clients.forEach(currClient => {
                        if (currClient.id.toLowerCase() == dataArray[1].toString().toLowerCase().trimEnd()) {
                            client.write("Username is taken")
                            usernameTaken = true
                        }
                    })
                    if (usernameTaken == false) {
                        client.id = dataArray[1].toString().trimEnd()
                        client.write('username successfully changed')
                    }
                }
            }
            //Kick
            else if (dataArray[0].toString().trimEnd() == '/kick') {
                console.log("kick initiated")
                if (dataArray[2].toString().trimEnd() == 'password') {
                    clients.forEach(currClient => {
                        if (currClient.id == dataArray[1].toString().trimEnd()) {
                            currClient.write('kick')
                        }
                    })
                    client.write("kick successful")
                }
                else {
                    client.write("incorrect password")
                }
            }
            //Client List
            else if (dataArray[0].toString().trimEnd() == '/clientlist') {
                console.log("clientlist")
                let clientlist = []
                clients.forEach(currClient => {
                    clientlist.push(currClient.id)
                })
                client.write(clientlist.toString())
            }
            //Invalid Command
            else {
                client.write("Please enter a valid command")
            }
        }
        //General Message
        else {
            clients.forEach(currClient => {
                if (currClient.id !== client.id) {
                    currClient.write(`${client.id}:  ${data}`);
                }
                else if (currClient.id === client.id) {
                    let message = `${client.id}:  ${data}`
                    fs.appendFile(fileName, message, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            })
        }
        console.log("Msg from client:" + data.toString());
    });
    client.on("end", () => {
        console.log('client disconnected')
        clients.forEach(currClient => {
            currClient.write(`${client.id} disconnected`)
        })
        let message = `${client.id} disconnected\n`
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