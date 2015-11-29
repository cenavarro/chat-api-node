var messagesController = function(Message) {

  var list = function(req, res) {
    Message.find({}, function(err, messages) {
      res.json(messages);
    });
  };

  return {
    list: list
  }
}

module.exports = messagesController;
