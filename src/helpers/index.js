const dbValidators=require("./db-validators");
const generarJWT=require("./generar-jwt");
const googlVerify=require("./google-verify");
const subirArchivo=require("./subir-archivo");
const comprobarJWT=require("./jwt");

module.exports={
    ...dbValidators,
    ...generarJWT,
    ...googlVerify,
    ...subirArchivo,
    ...comprobarJWT
};