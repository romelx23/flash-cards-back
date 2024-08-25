const { request, response } = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Game = require("./ai-history.model");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

const getAiHistory = async (req = request, res = response) => {
  try {
    const { limit = 10, desde = 0, search = "" } = req.query;

    let q = { status: true };

    if (search) {
      q = {
        $or: [{ gameTitle: { $regex: search, $options: "i" } }],
      };
    }

    const [total, histories] = await Promise.all([
      Game.countDocuments(q),
      Game.find(q).skip(Number(desde)).limit(Number(limit)),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "se obtuvieron los juegos",
      histories,
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

const createAiHistory = async (req = request, res = response) => {
  try {
    // const { ...data } = req.body;
    const { q } = req.query;
    console.log({ q });
    // console.log(model);
    // const { q, name = "No name", apikey, page = 1, limit = 10 } = req.query;
    //   const { limit = 10, desde = 0, search = "" } = req.query;
    //   const query = { status: true };

    // traer anime random de la api https://api.jikan.moe/v4/random/anime
    // traer anime random de esta temporada de la api https://api.jikan.moe/v4/anime
    // traer anime por año "https://api.jikan.moe/v4/anime?start_date=2024-07-01"

    // const randomNumber = Math.floor(Math.random() * 20) + 1;
    const randomNumber = 0;

    const anime = await fetch(
      "https://api.jikan.moe/v4/anime?q=" + "sao" + "&limit=2"
    );
    const animeData = await anime.json(); // contain mal_id

    // console.log(animeData.data[randomNumber]);

    const selectedAnime = animeData.data[randomNumber];

    // luego traer personajes de la api https://api.jikan.moe/v4/anime/${mal_id}/characters

    const characters = await fetch(
      `https://api.jikan.moe/v4/anime/${selectedAnime.mal_id}/characters`
    );
    const charactersData = await characters.json(); // contains characters

    // console.log(charactersData.data.map((c) => c.character.name));

    const formatAnimeSelected = {
      mal_id: selectedAnime.mal_id,
      title: selectedAnime.title,
      synopsis: selectedAnime.synopsis,
      image_url: selectedAnime.image_url,
      characters: charactersData.data.map((c) => c.character).splice(0, 5),
    };

    // creame un juego de rol con la data del anime y los personajes, en el cual el usuario pueda interactuar con los personajes y la historia del anime, de manera que pueda cambiar el rumbo de la historia, y que el juego tenga opciones de dialogo y de accion, y que el usuario pueda tomar decisiones que afecten el rumbo de la historia.

    const schemaHistory = {
      gameTitle: "Interactive RPG: Anime Adventure",
      introduction:
        "Welcome to the world of [Anime Title]. Your decisions will shape the story. Choose wisely!",
      storySynopsis: "[Anime Synopsis]",
      scenarios: [
        {
          sceneId: 1,
          location: "School",
          description:
            "You find yourself in the school, surrounded by familiar faces from [Anime Title]. The atmosphere is tense as something mysterious is about to unfold.",
          characters: [
            {
              name: "Character 1",
              image_url: "character1_image_url",
              dialogue: [
                {
                  id: 1,
                  text: "Something strange is happening, do you want to investigate?",
                  options: [
                    {
                      optionId: 1,
                      text: "Yes, let's investigate the classroom.",
                      nextSceneId: 2,
                    },
                    {
                      optionId: 2,
                      text: "No, let's stay here and observe.",
                      nextSceneId: 3,
                    },
                  ],
                },
              ],
            },
          ],
          actions: [
            {
              actionId: 1,
              description: "Leave the school.",
              nextSceneId: 4,
            },
          ],
        },
        {
          sceneId: 2,
          location: "Classroom",
          description: "You enter the classroom and find a mysterious note.",
          characters: [
            {
              name: "Character 2",
              image_url: "character2_image_url",
              dialogue: [
                {
                  id: 2,
                  text: "This note might be important, should we read it?",
                  options: [
                    {
                      optionId: 1,
                      text: "Read the note.",
                      nextSceneId: 5,
                    },
                    {
                      optionId: 2,
                      text: "Ignore the note.",
                      nextSceneId: 6,
                    },
                  ],
                },
              ],
            },
          ],
          actions: [
            {
              actionId: 2,
              description: "Go back to the hallway.",
              nextSceneId: 1,
            },
          ],
        },
        {
          sceneId: 3,
          location: "School Hallway",
          description:
            "You decide to stay in the hallway. Things seem calm for now.",
          characters: [],
          actions: [
            {
              actionId: 3,
              description: "Go to the classroom.",
              nextSceneId: 2,
            },
            {
              actionId: 4,
              description: "Leave the school.",
              nextSceneId: 4,
            },
          ],
        },
        {
          sceneId: 4,
          location: "Outside the School",
          description: "You leave the school. The mystery remains unsolved.",
          characters: [],
          actions: [
            {
              actionId: 5,
              description: "Go back inside.",
              nextSceneId: 1,
            },
          ],
        },
        {
          sceneId: 5,
          location: "Classroom",
          description:
            "The note reveals a clue to the mystery. You feel closer to solving it.",
          characters: [],
          actions: [
            {
              actionId: 6,
              description: "Follow the clue.",
              nextSceneId: 7,
            },
            {
              actionId: 7,
              description: "Ignore the clue and leave.",
              nextSceneId: 4,
            },
          ],
        },
        {
          sceneId: 6,
          location: "Classroom",
          description:
            "You ignore the note, but the tension in the room increases.",
          characters: [],
          actions: [
            {
              actionId: 8,
              description: "Read the note.",
              nextSceneId: 5,
            },
            {
              actionId: 9,
              description: "Leave the classroom.",
              nextSceneId: 4,
            },
          ],
        },
        {
          sceneId: 7,
          location: "Mystery Location",
          description:
            "Following the clue leads you to a new, mysterious location.",
          characters: [],
          actions: [
            {
              actionId: 10,
              description: "Investigate further.",
              nextSceneId: 8,
            },
            {
              actionId: 11,
              description: "Go back.",
              nextSceneId: 5,
            },
          ],
        },
        {
          sceneId: 8,
          location: "Final Scene",
          description:
            "You discover the truth behind the mystery. The story concludes here.",
          characters: [],
          actions: [
            {
              actionId: 12,
              description: "Restart the game.",
              nextSceneId: 1,
            },
          ],
        },
      ],
      playerChoices: {
        affectStory: true,
        choicesMade: [],
      },
    };

    const prompt = `create a rol game with the anime ${
      selectedAnime.title
    } and the characters ${selectedAnime.characters} and ${
      selectedAnime.synopsis
    } include scenary,dialogs, options and consecuences, with 3 scenery or whatever  yout think appropiate,  data in spanish language. using this JSON schema: ${JSON.stringify(
      schemaHistory
    )}`;

    // const prompt = `create a rol game with the anime ${
    //   selectedAnime.title
    // } and the characters ${selectedAnime.characters} and ${
    //   selectedAnime.synopsis
    // } in which the user can interact with the characters and the story of the anime, so that he can change the course of the story, and that the game has dialogue and action options, and that the user can make decisions that affect the course of the story in spanish language, with 3 scenery. using this JSON schema: ${JSON.stringify(
    //   schemaHistory
    // )}`;

    // const prompt = `Crea un juego de rol completo con el anime ${
    //   selectedAnime.title
    // } y personajes ${selectedAnime.characters} y ${
    //   selectedAnime.synopsis
    // } incluyendo todos los escenarios, personajes, diálogos, opciones y consecuencias. Asegúrate de que las elecciones afecten el curso de la historia. in spanish language, with 3 scenery. using this JSON schema: ${JSON.stringify(schemaHistory)}`;
    // : "Write a story about an AI and magic with a limit of 4 paragraph";

    console.log({ prompt });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // const text = response.join("\n");
    const gameData = response.text();
    console.log(typeof gameData);
    console.log({
      text: JSON.parse(gameData),
    });

    const parseGameData = JSON.parse(gameData);

    // save the game in the database
    await Game.create({
      animeData: formatAnimeSelected,
      gameTitle: parseGameData.gameTitle,
      introduction: parseGameData.introduction,
      storySynopsis: parseGameData.storySynopsis,
      scenarios: [...parseGameData.scenarios],
      playerChoices: {
        affectStory: true,
        choicesMade: [],
      },
    });
    console.log("se guardo el juego");

    return res.status(200).json({
      ok: true,
      msg: "se creo el juego",
      formatAnimeSelected,
      text: parseGameData,
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
  getAiHistory,
  createAiHistory,
};
