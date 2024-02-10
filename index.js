require('dotenv').config();
const Telegram = require('grammy');
const TOKEN = process.env.TOKEN;

const bot = new Telegram.Bot(TOKEN);

bot.on("message", ctx => {
    ctx.reply("Hi everyone!");
})

bot.start();