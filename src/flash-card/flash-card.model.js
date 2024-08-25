const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
      required: true,
    },
    example: {
      type: String,
      required: true,
    },
    game_card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameCard",
    },
  },
  {
    timestamps: true,
  }
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

module.exports = Flashcard;
