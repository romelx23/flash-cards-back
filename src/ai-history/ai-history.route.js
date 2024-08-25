const { Router } = require("express");
const { getAiHistory, createAiHistory } = require("./ai-history.controller");

const router = Router();

router.get("/", [], getAiHistory);

router.post("/", [], createAiHistory);

module.exports = router;
