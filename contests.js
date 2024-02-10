
var usaco = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=25&upcoming=true&format=json";
var codechef = "https://clist.by/api/v4/contest/?username=RuntimeError0&api_key=f11119d090d20aecdb2835c60d564587b92ac06a&resource_id=2&upcoming=true&format=json";

function updateContestsDaily(prevDay, chatid, threadid, ctx) {

    if(chatid === -1) {
        console.log("Invalid CHAT ID: " + chatid);
        return;
    }

    var now = new Date();
    var dateFormat = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Damascus",
        day: "numeric"
    });
    
    var day = dateFormat.format(now);

    if(day != prevDay) {
        ctx.reply("<b>Daily Report: </b>\n", {
            parse_mode: "HTML"
        })
        getCodeforces(chatid, threadid, 0, ctx);
        getContests(chatid, "Codechef", codechef, threadid, 0, ctx);
        getContests(chatid, "USACO", usaco, threadid, 0, ctx);
    }

    setTimeout(() => {
        updateContestsDaily(day, chatid, threadid, ctx);
    }, 1000 * 60 * 60);

}

function diff_hours(dt2, dt1) 
 {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
  
 }

async function getCodeforces(chatid, threadid, maxtime, ctx) {

    const response = await fetch("https://codeforces.com/api/contest.list?gym=false");
    const data = await response.json();

    console.log("GOT CODEFORCES DATA, IT'S HUGE: ");
    console.log(response);
    let message = "<b> <i> Codeforces Upcoming Contests: </i> </b>\n\n";

    let preMsg = [];
    let cnt = 0;

    for(var contest of data.result) {

        let msg = "";
        if(contest.phase != "BEFORE") continue;

        msg += "<b>Name:</b> " + contest.name + '\n';

        
        var dt = new Date(contest.startTimeSeconds * 1000);
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

        if(daydiff > maxtime) continue;
         

        msg += "<b>Date:</b> " + lastdate + '\n';
        msg += "<b>Time Left:</b> " +  daydiff + " days left\n";
        
        preMsg[cnt] = msg;
        cnt = cnt + 1;
    }

    preMsg.reverse();

    for(let tmp of preMsg) {
        message += tmp + '\n';
    }

    ctx.reply(message, {
        "parse_mode": "HTML",
    });


}

async function getContests(chatid, name, api, threadid, maxtime, bot) {

    const response = await fetch(api);
    const data = await response.json();

    let message = "<b> <i>" + name + " Upcoming Contests: </i> </b>\n\n";

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

        if(daydiff > maxtime) continue;

        msg += "<b>Date:</b> " + lastdate + '\n';
        msg += "<b>Time Left:</b> " +  daydiff + " days left\n";


        message += msg + '\n';
    }

    ctx.reply(message, {
        "parse_mode": "HTML",
    });

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

module.exports = {getCodeforces, getContests, updateContestsDaily, getDayNow};