const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  // console.log(token);

  if (!token) {
    return res.status(401).json({
      ok:false,
      msg: "No hay token en la peticion",
    });
  }

  //*   console.log(token);
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresponde al uid
    const user = await User.findById(uid);
    // console.log(user);

    if(!user){
      return res.status(401).json({
        ok:false,
        msg: "Token no valido - usuario no existe en BD",
      });
    }

    // Vertificar sui el uid tiene estado true
    if (!user.status) {
      // no tengo permisos status 401
      return res.status(401).json({
        ok:false,
        msg: "Token no valido - usuario con estado:false",
      });
    }
    // req.uid=uid;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
