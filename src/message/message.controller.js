const { request, response } = require("express");
const Message = require("./message.model");

const getMessagesByUser = async (req = request, res = response) => {
  //   get messages by user
  const {_id:id} = req.usuario;
  const mensajeDe=req.params.de;
  console.log({id,mensajeDe});
  const messages = await Message.find({
    $or: [
        { de: id , para: mensajeDe },
        {de:mensajeDe,para:id}
    ]
  }).sort({createdAt:"asc"})
  .populate("de","nombre imagen")
  .populate("para","nombre imagen")
  .limit(30);
  res.status(200).json({
    total: messages.length,
    messages,
  });
};

module.exports = {
    getMessagesByUser,
};
