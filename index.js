require('dotenv').config();
const Telegram = require('grammy');
const TOKEN = process.env.TOKEN;

const bot = new Telegram.Bot("6989861872:AAGS3k5BTWo1SK7SURCB2JpX79XUQ4uw4gs");

bot.on("message", ctx => {
    ctx.reply("Hi everyone!");
})

bot.start();