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
        if (dataArray[0][0] == '/') {
            //Whisper
            if (dataArray[0].toString().trimEnd() == '/w' || dataArray[0].toString().trimEnd() == '/whisper') {
                if (client.id.toLowerCase() !== dataArray[1].toString().toLowerCase().trimEnd()) {
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
                                clientExists = true
                                let message = `${client.id} whispered to ${currClient.id}: ${whisperMessage}\n`
                                fs.appendFile(fileName, message, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                        })
                        if (clientExists == false) {
                            client.write("Client does not exist")
                        }
                    }
                }
                else {
                    client.write("You can't whisper to yourself")
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
                        let oldClientId = client.id
                        client.id = dataArray[1].toString().trimEnd()
                        clients.forEach(currClient => {
                            if (currClient.id.toLowerCase() !== dataArray[1].toString().toLowerCase().trimEnd()) {
                                currClient.write(`${oldClientId} changed their username to ${dataArray[1].toString().trimEnd()}`)
                            }
                            else {
                                let message = `${oldClientId} changed their username to ${dataArray[1].toString().trimEnd()}\n`
                                fs.appendFile(fileName, message, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                        })
                        client.write('username successfully changed')
                    }
                }
            }
            //Kick
            else if (dataArray[0].toString().trimEnd() == '/kick') {
                if (client.id.toLowerCase() !== dataArray[1].toString().toLowerCase().trimEnd()) {
                    console.log("kick initiated")
                    let clientToKick = ''
                    if (dataArray[2]) {
                        if (dataArray[2].toString().trimEnd() == "password") {
                            clients.forEach(currClient => {
                                if (currClient.id.toLowerCase() == dataArray[1].toString().toLowerCase().trimEnd()) {
                                    currClient.write(`Kicked by ${client.id}\n`)
                                    clientToKick = currClient
                                }
                            })
                            clients.forEach(currClient => {
                                if (currClient.id.toLowerCase() !== client.id.toLowerCase() && currClient.id.toLowerCase() !== clientToKick.id.toLowerCase()) {
                                    currClient.write(`${client.id} kicked ${dataArray[1].toString().toLowerCase().trimEnd()} out of the chat`)
                                }
                                else if (currClient.id.toLowerCase() === client.id.toLowerCase()) {
                                    let message = `${client.id} kicked ${dataArray[1].toString().toLowerCase().trimEnd()} out of the chat\n`
                                    fs.appendFile(fileName, message, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                }
                            })
                            clientToKick.write('kick')
                            client.write("kick successful")
                        }

                        else {
                            client.write("incorrect password")
                        }
                    }
                    else {
                        client.write("command must include password")
                    }
                }
                else {
                    client.write("You can't kick yourself")
                }
            }
            //Client List
            else if (dataArray[0].toString().trimEnd() == '/clientlist') {
                console.log('client list')
                let clientlist = []
                clients.forEach(currClient => {
                    clientlist.push(currClient.id)
                })
                client.write(clientlist.toString())
                let message = `Client List: ${clientlist.toString()}`
                fs.appendFile(fileName, message, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
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
        let clientIndex = clients.indexOf(client)
        clients.splice(clientIndex, 1)
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
let serverStartLog = 'Server Started Successfully\n'
fs.appendFile(fileName, serverStartLog, (err) => {
    if (err) {
        console.log(err);
    }
})