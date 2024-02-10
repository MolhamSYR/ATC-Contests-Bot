require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const Telegram = require('grammy');
const TOKEN = process.env.TOKEN;
const bot = new Telegram.Bot(TOKEN);
const contests = require('./contests');
var MAIN_CHANNEL = process.env.MAIN_CHANNEL;
var MAIN_THREAD = process.env.MAIN_THREAD;
const MAX_DAYS = 5;

var day = contests.getDayNow();

setTimeout(() => {
    contests.updateContestsDaily(day-1, MAIN_CHANNEL, MAIN_THREAD);
}, 5000);

bot.command('start', async (ctx) => {
    await ctx.reply("Hello! Welcome to Aleppo Teenagers Competitors' Bot!");
});

bot.command('setmainchannel', async (ctx) => {
    process.env['MAIN_CHANNEL'] = ctx.message.chat.id;

    if(ctx.message.is_topic_message) {
        process.env['MAIN_THREAD'] = ctx.message.message_thread_id;
        MAIN_THREAD = process.env.MAIN_THREAD;
    }

    MAIN_CHANNEL = process.env.MAIN_CHANNEL;

});

bot.command("contests", async (ctx) => {
    const msg = ctx.message;
    const platform = ctx.match;
    const topic = ctx.message.is_topic_message ? ctx.message.message_id : undefined;
    if(platform == "codeforces") {
        contests.getCodeforces(msg.chat.id, topic, MAX_DAYS);
    }

    else if(platform == "codechef") {
        contests.getContests(msg.chat.id, "Codechef", codechef, topic, MAX_DAYS);
    }

    else if(platform == "usaco") {
        contests.getContests(msg.chat.id, "USACO", usaco, topic, MAX_DAYS);
    }

    else {
        bot.api.sendMessage(msg.chat.id, "Platform " + platform + " isn't in my database!", {
            message_thread_id: topic
        });
    }

});




app.post('/webhook', Telegram.webhookCallback(bot, "express"));

app.listen(3000, () => {
    bot.api.setWebhook("" + process.env.SERVER_URL + "/webhook");
    console.log("Running!");
})

module.exports = { bot };