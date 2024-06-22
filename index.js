import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Socket } from 'engine.io';
import Telegram from 'node-telegram-bot-api';
import ejs from 'ejs'

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views')
const botToken = "6810179173:AAEPIruORLBjC3U8x3ufuz9TfTaVXbETh2s";
const bot = new Telegram(botToken, { polling: true });
const server = http.createServer(app);
const PORT = 4000;

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome To Chat Bot, Lets chat👸👱‍♂️");
});

app.get('/chat', (req, res) => {
    return res.render('chat')
})

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (Socket) => {
    console.log("Socket Connected!!!");

    const currentDate = new Date();
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const currentTime = `${hours}:${minutes}`;
    var c ;

    bot.on("message", async (msg) => {
        console.log(msg,"ok")
        c=msg.chat.id;
        const msgData = {
            name: msg.from.first_name,
            text: msg.text,
            time:currentTime,
            id:msg.chat.id

        }
        const chatId = msg.chat.id;
        Socket.emit('bot-msg', msgData);

       

    });
    Socket.on('new_message', (msg) => {
        bot.sendMessage(c, msg)
    })



})


server.listen(PORT, (err) => {
    if (err) {
        return console.log("There is error with srver ", err);
    }
    console.log("server is running at ", PORT);
})