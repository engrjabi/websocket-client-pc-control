require("dotenv").config();

const wsClientIntentList = require("./wsClientIntentList");
const launchShellCommand = require("../helpers/launchShellCommand");

module.exports = (messageInput, db) => {
  if (
    messageInput.intentName === wsClientIntentList.ComputerCommandScreenShot
  ) {
    const aliasName = "takeScreenShot";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }
};
