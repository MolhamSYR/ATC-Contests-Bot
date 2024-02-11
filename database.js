const CyclicDB = require('@cyclic.sh/dynamodb');
const database = CyclicDB(process.env.CYCLIC_DB);

const db = database.collection('groups');

async function getMainThreadId(chatID) {

    var key = chatID.toString();

    var item = await db.get(key);
    console.log("GOT A REQUEST FOR ITEM: ");
    console.log(item);
    return item.props.threadID;
}

async function getGroups() {

    var groups = await db.get("allGroups").props.groups;

    if(groups == undefined) {
        await db.set("allGroups", {
            "groups": []
        });
        groups = [];
    }

    return groups;
}

async function addGroup(chatID) {

    var groups = await db.get("allGroups").props.groups;

    if(groups == undefined) {
        await db.set("allGroups", {
            "groups": []
        });
        groups = [];
    }

    groups.push(chatID);

}

async function setMainThreadId(chatID, threadID) {

    var key = chatID.toString();

    await db.set(key , {
        "threadID": threadID
    });

    var groups = await db.get("allGroups");

    groups.props.groups.push(chatID);

    await db.set("allGroups", groups);

}

module.exports = { setMainThreadId, getMainThreadId, getGroups, addGroup };