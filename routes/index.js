var express = require("express");
var router = express.Router();

let message_id = 0;

router.get("/", function(req, res) {
  if (req && req.query && req.query.id && global.wssWithId[req.query.id]) {
    message_id = message_id + 1;

    global.wssWithId[req.query.id].send(
      JSON.stringify({
        ...req.query,
        message_id: message_id
      })
    );

    const messageHandler = data => {
      console.log(data);
      res.status(200).send(data);
      global.wssWithId[req.query.id].removeListener("message", messageHandler);
    };

    global.wssWithId[req.query.id].on("message", messageHandler);
  }

  // TODO: Add a feature for multiple receivers when the need arise
  // global.wss.clients.forEach(client => {
  //   client.send(JSON.stringify(req.query));
  // });
});

module.exports = router;
