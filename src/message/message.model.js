const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
    de: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

MessageSchema.methods.toJSON = function () {
    const { __v, _id, ...message } = this.toObject(); //eslint-disable-line
    message.uid = _id;
    return message;
};

const Message = model("Message", MessageSchema);
module.exports = Message;