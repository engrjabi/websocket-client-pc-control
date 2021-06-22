require("dotenv").config();

const { spawn } = require("child_process");
const wsClientIntentList = require("./wsClientIntentList");

module.exports = (text, db) => {
  if (text.includes(wsClientIntentList.TAKE_SCREENSHOT)) {
    const aliasName = "takeScreenShot";
    console.log("Invoke Command:", aliasName);

    const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(" "), {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"]
    });
    child.unref();
  }
};
