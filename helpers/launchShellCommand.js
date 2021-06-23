require("dotenv").config();

const { spawn } = require("child_process");
const isEmpty = require("lodash/isEmpty");

module.exports = commandString => {
  if (isEmpty(commandString)) {
    return;
  }

  const child = spawn(process.env.SHELL, `-i -c ${commandString}`.split(" "), {
    detached: true,
    stdio: ["ignore", "ignore", "ignore"]
  });
  child.unref();
  return child;
};
