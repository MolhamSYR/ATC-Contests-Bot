require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const database = require('./database');
const Telegram = require('grammy');
const TOKEN = process.env.TOKEN;
const bot = new Telegram.Bot(TOKEN);
const contests = require('./contests');
var MAIN_CHANNEL = process.env.MAIN_CHANNEL;
var MAIN_THREAD = process.env.MAIN_THREAD;
const MAX_DAYS = 5;

bot.command('start', async (ctx) => {
    await ctx.reply("Hello! Welcome to Aleppo Teenagers Competitors' Bot!\nIf you are in a supergroup, Make sure to use the command /setmainchannel");
});



bot.command('setmainchannel', async (ctx) => {

    var chatID = ctx.message.chat.id;
    var threadID = undefined;
    if(ctx.message.is_topic_message) {
        threadID = ctx.message.message_thread_id;
    }

    database.setMainThreadId(chatID, threadID);

    ctx.reply("<b>This channel has been set as main channel successfully!</b>" , {
        parse_mode: "HTML"
    })
});

bot.command("contests", async (ctx) => {
    const msg = ctx.message;
    const txt = msg.text;
    const platform = txt.substring(txt.indexOf(" ") + 1);
    var usaco = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=25&upcoming=true&format=json";
    var codechef = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=2&upcoming=true&format=json";
    var atcoder = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=93&upcoming=true&format=json";
    var codeforces = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=1&upcoming=true&format=json";
    const topic = ctx.message.is_topic_message ? ctx.message.message_id : undefined;
    if(platform == "codeforces") {
        const tosend = await contests.getContests(msg.chat.id, "Codeforces", codeforces ,topic,7);
        await ctx.reply(tosend, {
            parse_mode: "HTML"
        });
    }

    else if(txt == "/contests") {
        const tosend = await contests.getAllContests(7);
        await ctx.reply(tosend, {
            parse_mode: "HTML"
        });
    }

    else if(platform == "codechef") {
        const tosend = await contests.getContests(msg.chat.id, "Codechef", codechef, topic, 7);
        await ctx.reply(tosend, {
            parse_mode: "HTML"
        });
    }

    else if(platform == "atcoder") {
        const tosend = await contests.getContests(msg.chat.id, "AtCoder", atcoder, topic, 7);
        await ctx.reply(tosend, {
            parse_mode: "HTML"
        });
    }

    else if(platform == "usaco") {
        const tosend = await contests.getContests(msg.chat.id, "USACO", usaco, topic, 7);
        await ctx.reply(tosend, {
            parse_mode: "HTML"
        });
    }

    else {
        ctx.reply("Platform " + platform + " isn't in my database!");
    }

});

contests.updateContestsDaily(contests.getDayNow() - 1, bot);


app.post('/webhook', Telegram.webhookCallback(bot, "express"));

app.listen(3000, () => {
    bot.api.setWebhook("" + process.env.SERVER_URL + "/webhook");
    console.log("Running!");
})

module.exports = { bot };