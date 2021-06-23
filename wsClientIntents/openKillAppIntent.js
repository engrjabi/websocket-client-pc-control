require("dotenv").config();

const _camelCase = require("lodash/camelCase");
const get = require("lodash/get");
const wsClientIntentList = require("./wsClientIntentList");
const launchShellCommand = require("../helpers/launchShellCommand");
const kill = require("tree-kill");

module.exports = (messageInput, db) => {
  if (messageInput.intentName === wsClientIntentList.ComputerCommandCloseApp) {
    const aliasName = get(messageInput, "appName.value", "").trim();
    const existingProcess = db.get(`processes.${aliasName}`).value();

    if (existingProcess && existingProcess.pid) {
      kill(existingProcess.pid);
      db.set(`processes.${aliasName}`, {}).write();
      return;
    }
  }

  if (messageInput.intentName === wsClientIntentList.ComputerCommandOpenApp) {
    const aliasName = get(messageInput, "appName.value", "").trim();

    console.log("Invoke Command:", aliasName);
    const child = launchShellCommand(aliasName);
    db.set(`processes.${aliasName}`, child).write();
  }
};
