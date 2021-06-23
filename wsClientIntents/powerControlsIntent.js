require("dotenv").config();

const wsClientIntentList = require("./wsClientIntentList");
const launchShellCommand = require("../helpers/launchShellCommand");

module.exports = (messageInput, db, responseHandler) => {
  if (messageInput.intentName === wsClientIntentList.ComputerCommandShutdown) {
    responseHandler("Turning off the computer");
    const aliasName = "turnOff";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }

  if (messageInput.intentName === wsClientIntentList.ComputerCommandRestart) {
    responseHandler("Restarting the computer");
    const aliasName = "restartSystem";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }

  if (messageInput.intentName === wsClientIntentList.ComputerCommandLock) {
    responseHandler("Locking off the computer");
    const aliasName = "lockdown";
    console.log("Invoke Command:", aliasName);
    launchShellCommand(aliasName);
  }
};
