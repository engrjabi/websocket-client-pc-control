var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  if (req && req.query && req.query.id && global.wssWithId[req.query.id]) {
    global.wssWithId[req.query.id].send(JSON.stringify(req.query));
  }

  // TODO: Add a feature for multiple receivers when the need arise
  // global.wss.clients.forEach(client => {
  //   client.send(JSON.stringify(req.query));
  // });

  res.send("hi");
});

module.exports = router;
