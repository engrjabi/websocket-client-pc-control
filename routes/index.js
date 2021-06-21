var express = require("express");
var router = express.Router();
var _isString = require("lodash/isString");

router.get("/", function(req, res) {
  const text = req.query.text;

  if (_isString(text)) {
    global.wss.clients.forEach(client => {
      client.send(text);
    });
  }

  res.send("hi");
});

module.exports = router;
