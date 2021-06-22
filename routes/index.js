var express = require("express");
var router = express.Router();
var _isString = require("lodash/isString");

router.get("/", function(req, res) {
  global.wss.clients.forEach(client => {
    client.send(JSON.stringify(req.query));
  });

  res.send("hi");
});

module.exports = router;
