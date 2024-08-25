const { request, response } = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const FlashCard = require("./flash-card.model");
const GameCard = require("./game-card.model");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

const getGames = async (req = request, res = response) => {
  try {
    const { limit = 10, desde = 0, search = "" } = req.query;

    let q = { status: true };

    if (search) {
      q = {
        $or: [{ gameTitle: { $regex: search, $options: "i" } }],
      };
    }

    const [total, games] = await Promise.all([
      GameCard.find(q).countDocuments(),
      GameCard.find(q).skip(Number(desde)).limit(Number(limit)),
    ]);

    console.log(total, games);

    return res.status(200).json({
      ok: true,
      msg: "get flash cards",
      games,
      total,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getFlashCards = async (req = request, res = response) => {
  try {
    const { limit = 50, desde = 0, search = "" } = req.query;

    const id = req.params.id;

    let q = {
      status: true,
      game_card: id,
    };

    if (search) {
      q = {
        $or: [{ topic: { $regex: search, $options: "i" } }],
      };
    }

    const [total, cards] = await Promise.all([
      FlashCard.find(q).countDocuments(),
      FlashCard.find(q).skip(Number(desde)).limit(Number(limit)),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "get cards",
      cards,
      total,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const createFlashCards = async (req = request, res = response) => {
  try {
    // const { themeGame } = req.body;
    // const { q } = req.query;
    // console.log({ q });

    // creame un juego de rol con la data del anime y los personajes, en el cual el usuario pueda interactuar con los personajes y la historia del anime, de manera que pueda cambiar el rumbo de la historia, y que el juego tenga opciones de dialogo y de accion, y que el usuario pueda tomar decisiones que afecten el rumbo de la historia.

    const schemaHistory = {
      title: "English to Spanish Flashcards",
      description:
        "Create a set of flashcards to help you learn English to Spanish translations.",
      cards: [
        {
          topic: {
            type: "string",
            description: "The topic of the flashcard.",
          },
          word: {
            type: "string",
            description: "The English word to translate.",
          },
          definition: {
            type: "string",
            description: "The Spanish translation of the word.",
          },
          example: {
            type: "string",
            description: "An example sentence using the word.",
          },
        },
      ],
    };

    // const theme = themeGame ? themeGame : "basics phrasal verbs";
    // const theme = themeGame ? themeGame : "common verbs used in shopping";
    const theme = "common phrases used with friends";

    const prompt = `create a 30 flash cards english and spanish with theme ${theme} using this JSON schema: ${JSON.stringify(
      schemaHistory
    )}`;

    console.log({ prompt });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // const text = response.join("\n");
    const gameData = response.text();
    // console.log(typeof gameData);
    // console.log({
    //   text: JSON.parse(gameData),
    // });

    const parseFlashData = JSON.parse(gameData);

    console.log("game data parse", gameData);
    console.log("game data parse", parseFlashData);

    // save game card
    const gameCardCreated = new GameCard({
      title: parseFlashData.title,
      description: parseFlashData.description,
    });

    await gameCardCreated.save();

    // save the cards in the database
    parseFlashData.cards.forEach(async (card) => {
      const { topic, word, definition, example } = card;
      const flashCard = new FlashCard({
        topic,
        word,
        definition,
        example,
        game_card: gameCardCreated._id,
      });

      await flashCard.save();
    });

    console.log("se guardo el juego", parseFlashData);

    return res.status(200).json({
      ok: true,
      msg: "se creo el juego",
      flashCards: parseFlashData,
      // charactersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getGames,
  getFlashCards,
  createFlashCards,
};
