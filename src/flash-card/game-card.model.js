const mongoose = require("mongoose");

const GameCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GameCard = mongoose.model("GameCard", GameCardSchema);

module.exports = GameCard;
