require("dotenv").config();

const { spawn } = require("child_process");
const _camelCase = require("lodash/camelCase");
const wsClientIntentList = require("./wsClientIntentList");
const kill = require("tree-kill");

module.exports = (text, db) => {
  if (text.includes(wsClientIntentList.TERMINATE)) {
    const aliasName = _camelCase(
      text.replace(wsClientIntentList.TERMINATE, "").trim()
    );
    const existingProcess = db.get(`processes.${aliasName}`).value();

    if (existingProcess && existingProcess.pid) {
      kill(existingProcess.pid);
      return;
    }
  }

  if (text.includes(wsClientIntentList.OPEN)) {
    const aliasName = _camelCase(
      text.replace(wsClientIntentList.OPEN, "").trim()
    );

    console.log("Invoke Command:", aliasName);

    const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(" "), {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"]
    });
    child.unref();

    db.set(`processes.${aliasName}`, child).write();
  }
};
