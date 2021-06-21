require("dotenv").config();

const { spawn } = require("child_process");
const _camelCase = require("lodash/camelCase");
const kill = require("tree-kill");

module.exports = (text, db) => {
  if (text.includes("terminate")) {
    const aliasName = _camelCase(text.replace("terminate", "").trim());
    const existingProcess = db.get(`processes.${aliasName}`).value();

    if (existingProcess && existingProcess.pid) {
      kill(existingProcess.pid);
      return;
    }
  }

  const aliasName = _camelCase(text.trim());
  console.log("Invoke Command:", aliasName);

  const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(" "), {
    detached: true,
    stdio: ["ignore", "ignore", "ignore"]
  });
  child.unref();

  db.set(`processes.${aliasName}`, child).write();
};
