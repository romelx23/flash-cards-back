const { Router } = require("express");
const { validarJWT, validarCampos } = require("../middlewares");
const { check } = require("express-validator");
const { getMessagesByUser } = require("./message.controller");

const router=Router();

router.get("/:de",
[
    check("de", "No es un mongo ID").isMongoId(), validarJWT,
     validarCampos
]
,getMessagesByUser);

module.exports=router;