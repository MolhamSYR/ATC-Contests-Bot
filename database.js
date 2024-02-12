require('dotenv').config();
const CyclicDB = require('@cyclic.sh/dynamodb');
const DATABASE_TOKEN = process.env.CYCLIC_DB;
const database = CyclicDB(DATABASE_TOKEN);



async function getMainThreadId(chatID) {
    const db = database.collection('groups');
    var key = chatID.toString();

    var item = await db.get(key);

    if(item.props.threadID === -1) return undefined;

    return item.props.threadID;
}

async function getGroups() {

    const db = database.collection('groups');
    var AllGroups = await db.get("AllGroups");

    if(AllGroups === undefined || AllGroups === null) {

        await db.set("AllGroups", {
            "groups": []
        });

    }

    console.log("HERE IS GROUP LIST: " + AllGroups.props.groups);

    return AllGroups.props.groups;
}
// 90% DONE DEBUGGING
async function addGroup(chatID) {
    const db = database.collection('groups');
    var AllGroups = await db.get("AllGroups");
 
    if(AllGroups === undefined || AllGroups === null) {
      
        await db.set("AllGroups", {
            "groups": []
        });
    }

    AllGroups = await db.get("AllGroups");

    var groups = AllGroups.props.groups;
    

        groups.union([chatID]);
        
        await db.set("AllGroups", {
            "groups": groups
        });

    
}

async function setMainThreadId(chatID, threadID) {

    const db = database.collection('groups');
    var key = chatID.toString();
    console.log("Trying to set Thread ID to: " + threadID + " :");
    if(threadID != undefined) {
        await db.set(key , {
            "threadID": threadID
        });
    }

    else {
        await db.set(key, {"threadID": -1});
    }

    var test = await db.get(key);

    console.log("" + chatID + " 's Thread ID has been set to " + test.props.threadID);

}

module.exports = { setMainThreadId, getMainThreadId, getGroups, addGroup };