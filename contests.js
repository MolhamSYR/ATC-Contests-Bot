var usaco = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=25&upcoming=true&format=json";
var codechef = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=2&upcoming=true&format=json";
var atcoder = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=93&upcoming=true&format=json";
var codeforces = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=1&upcoming=true&format=json";
const database = require('./database');
const ALL_NAMES = ["Codeforces" , "AtCoder", "Codechef", "USACO"];
var ALL_PLATFORMS = new Map();

ALL_PLATFORMS.set("Codeforces", codeforces);
ALL_PLATFORMS.set("AtCoder", atcoder);
ALL_PLATFORMS.set("Codechef", codechef);
ALL_PLATFORMS.set("USACO", usaco);

async function getAllContests(maxtime) {

    let message = "<b> <i>Upcoming Contests in 7 Days</i> </b>\n\n";
    let allContests = [];
    for(platname of ALL_NAMES) {

        const api = ALL_PLATFORMS.get(platname);

        const response = await fetch(api);
        const data = await response.json();
        console.log("GOT SOME HUGE DATA FROM " + platname);
        console.log(data.objects);
        
        
    
        for(var contest of data.objects) {
          
            let msg = "";

            msg += "<b>Name:</b> " + contest.event + '\n';

            var dt = new Date(contest.start);
            var now = new Date();
            var dateFormat = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Damascus",
                hour: "numeric",
                minute: "numeric",
                year: "numeric",
                day: "numeric",
                month: "numeric"
            
            });
            var lastdate = dateFormat.format(dt);
            var start = dt - now;
            var daydiff = Math.floor(start / (1000 * 60 * 60 * 24));  

            if(daydiff > maxtime || daydiff < 0) continue;
            msg += "<b>Platform:</b> " + platname + '\n';
            msg += "<b>Date:</b> " + lastdate + '\n';
            msg += "<b>Time Left:</b> " +  daydiff + " days left\n";

            var pair = {"key": daydiff, "value": msg};
            allContests.push(pair);
        }

        allContests.sort((a,b) => {
            if(a.key < b.key) return -1;
            else if(a.key == b.key) return 0;
            else return 1;
        })


    }

    for(one of allContests) {
        message += one.value + '\n';
    }

    return message;

}


async function updateContestsDaily(bot) {

        const toSend = await getAllContests(7);
        console.log("GOT TO PREV DAY != DAY");

        var groups = await database.getGroups();
        console.log("GOT MESSAGE: ");

        console.log(toSend);

        for(var chatID of groups) {

            console.log("SENDING TO CHAT ID: " + chatID);
            var threadID = await database.getMainThreadId(chatID);
    
            bot.api.sendMessage(chatID, toSend, {
                parse_mode: "HTML",
                message_thread_id: threadID
            });

        }

        setTimeout(() => {
            updateContestsDaily(bot);
        }, 1000 * 10);

}



function diff_hours(dt2, dt1) 
 {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
  
 }

async function getContests(chatid, name, api, threadid, maxtime) {

    const response = await fetch(api);
    const data = await response.json();
    console.log("GOT SOME HUGE DATA FROM " + name);
    console.log(data.objects);
    let message = "<b> <i>" + name + " Upcoming Contests: </i> </b>\n\n";
    let allContests = [];
    
    for(var contest of data.objects) {
        
        
        let msg = "";

        msg += "<b>Name:</b> " + contest.event + '\n';

        var dt = new Date(contest.start);
        var now = new Date();
        var dateFormat = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Damascus",
            hour: "numeric",
            minute: "numeric",
            year: "numeric",
            day: "numeric",
            month: "numeric"
            
        });
        var lastdate = dateFormat.format(dt);
        var start = dt - now;
        var daydiff = Math.floor(start / (1000 * 60 * 60 * 24));  

        if(daydiff > maxtime || daydiff < 0) continue;
        msg += "<b>Platform:</b> " + name + '\n';
        msg += "<b>Date:</b> " + lastdate + '\n';
        msg += "<b>Time Left:</b> " +  daydiff + " days left\n";

        var pair = {"key": daydiff, "value": msg};
        allContests.push(pair);
    }

    allContests.sort((a,b) => {
        if(a.key < b.key) return -1;
        else if(a.key == b.key) return 0;
        else return 1;
    })

    for(one of allContests) {
        message += one.value + '\n';
    }

    return message;

}

function getDayNow() {

    var now = new Date();
    var dateFormat = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Damascus",
        day: "numeric"
    });
    
    var day = dateFormat.format(now);

    return day;
}

module.exports = {getAllContests, getContests, updateContestsDaily, getDayNow};