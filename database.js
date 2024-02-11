require('dotenv').config();
const CyclicDB = require('@cyclic.sh/dynamodb');
const DATABASE_TOKEN = process.env.CYCLIC_DB;
const database = CyclicDB(DATABASE_TOKEN);



async function getMainThreadId(chatID) {
    const db = database.collection('groups');
    var key = chatID.toString();

    var item = await db.get(key);
    console.log("GOT A REQUEST FOR ITEM: ");
    console.log(item);
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

async function addGroup(chatID) {
    const db = database.collection('groups');
    var AllGroups = await db.get("allGroups");
    console.log("ADDING " + chatID + " TO GROUPS!!!");
    if(AllGroups == undefined || AllGroups == null) {
        console.log("GROUPS IS UNDEFINED OR NULL !!!");
        await db.set("allGroups", {
            "groups": []
        });
    }

    AllGroups = await db.get("allGroups");

    var groups = AllGroups.props.groups;
    console.log("FOUND GROUPS!!!");
    console.log(groups);
    if(groups.indexOf(chatID) === -1) {

        groups.push(chatID);
        
        await db.set("allGroups", {
            "groups": groups
        });

    }

    console.log("NEW GROUPS: " + groups);

}

async function setMainThreadId(chatID, threadID) {
    const db = database.collection('groups');
    var key = chatID.toString();

    await db.set(key , {
        "threadID": threadID
    });

    var groups = await db.get("allGroups");

    await db.set("allGroups", groups);

}

module.exports = { setMainThreadId, getMainThreadId, getGroups, addGroup };