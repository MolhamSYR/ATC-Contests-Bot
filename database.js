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
    const {results : groupsData} = await db.list();

    var groupsList = [];

    groupsData.map(key => {
        groupsList.push(key);
    });

    return groupsList;
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

module.exports = { setMainThreadId, getMainThreadId, getGroups };
