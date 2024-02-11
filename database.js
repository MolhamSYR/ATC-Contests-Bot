require('dotenv').config();
const CyclicDB = require('@cyclic.sh/dynamodb');
const DATABASE_TOKEN = process.env.CYCLIC_DB;
const database = CyclicDB(DATABASE_TOKEN);



async function getMainThreadId(chatID) {
    const db = database.collection('groups');
    var key = chatID.toString();

    var item = await db.get(key);
    
    return item.props.threadID;
}

async function getGroups() {
    const db = database.collection('groups');
    var AllGroups = await db.get("allGroups");

    if(AllGroups == undefined || AllGroups == null) {
        await db.set("allGroups", {
            "groups": []
        });

    }

    return AllGroups.props.groups;
}
// 90% DONE DEBUGGING
async function addGroup(chatID) {
    const db = database.collection('groups');
    var AllGroups = await db.get("allGroups");
 
    if(AllGroups == undefined || AllGroups == null) {
      
        await db.set("allGroups", {
            "groups": []
        });
    }

    AllGroups = await db.get("allGroups");

    var groups = AllGroups.props.groups;
    

    if(groups.indexOf(chatID) === -1) {

        groups.push(chatID);
        
        await db.set("allGroups", {
            "groups": groups
        });

    }

}

async function setMainThreadId(chatID, threadID) {

    const db = database.collection('groups');
    var key = chatID.toString();
    console.log("Trying to set Thread ID to: " + threadID + " :");
    await db.set(key , {
        "threadID": threadID
    });

    var test = await db.get(key);

    console.log("" + chatID + " 's Thread ID has been set to " + test.props.threadID);

}

module.exports = { setMainThreadId, getMainThreadId, getGroups, addGroup };