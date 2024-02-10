require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const Telegram = require('grammy');
const TOKEN = process.env.TOKEN;
const bot = new Telegram.Bot(TOKEN);

bot.on("message", ctx => {
    console.log("RECIEVED MESSAGE");
    ctx.reply("Hi everyone!");
});

app.post('/webhook', Telegram.webhookCallback(bot, "express"));

app.listen(3000, () => {
    bot.api.setWebhook("" + process.env.SERVER_URL + "/webhook");
    console.log("Running!");
})