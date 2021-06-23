require("dotenv").config();

const wsClientIntentList = require("./wsClientIntentList");
const launchShellCommand = require("../helpers/launchShellCommand");

module.exports = (messageInput, db) => {
  if (messageInput.intentName === wsClientIntentList.ComputerCommandShutdown) {
    const aliasName = "turnOff";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }

  if (messageInput.intentName === wsClientIntentList.ComputerCommandRestart) {
    const aliasName = "restartSystem";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }

  if (messageInput.intentName === wsClientIntentList.ComputerCommandLock) {
    const aliasName = "lockdown";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }
};
