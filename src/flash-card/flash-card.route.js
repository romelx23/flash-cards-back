const { Router } = require("express");
const {
  getGames,
  createFlashCards,
  getFlashCards,
} = require("./flash-card.controller");

const router = Router();

router.get("/", [], getGames);

router.get("/:id", [], getFlashCards);

router.post("/", [], createFlashCards);

module.exports = router;
