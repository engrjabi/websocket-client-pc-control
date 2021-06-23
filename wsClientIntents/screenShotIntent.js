require("dotenv").config();

const wsClientIntentList = require("./wsClientIntentList");
const launchShellCommand = require("../helpers/launchShellCommand");

module.exports = (messageInput, db, responseHandler) => {
  if (
    messageInput.intentName === wsClientIntentList.ComputerCommandScreenShot
  ) {
    responseHandler("Taking Screenshot");
    const aliasName = "takeScreenShot";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }
};
