const { request, response } = require("express");

const User = require("../user/user.model");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email Existe

    const user = await User.findOne({ email });

    console.log(user);
    if (!user) {
      return res.status(400).json({
        msg: "Usuario /Password no son correctos-correo"
      });
    }

    // Si el usuario esta activo

    if (!user.status) {
      return res.status(400).json({
        msg: "Usuario /Password no son correctos-status:false"
      });
    }

    // Verificar la contraseña

    const validarPassword = bcryptjs.compareSync(password, user.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Usuario /Password no son correctos-password"
      });
    }

    // Generar el JWT
    const token = await generarJWT(user.id);

    return res.status(200).json({
      ok: true,
      user,
      token
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el admnistrador"
    });
  }
};

// revaidar token

const renewToken = async (req = request, res = response) => {
  const { user } = req;

  // Generar el JWT
  const token = await generarJWT(user.id);

  res.json({
    user,
    token
  });
};

// Google SignIn

const GoogleSignin = async (req = request, res = response) => {
  const { id_token: idToken } = req.body;
  console.log(idToken);
  const { email, name, img } = await googleVerify(idToken);

  let user = await User.findOne({ email });

  try {
    if (!user) {
    // Tengo que crearlo
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true
      };

      user = new User(data);
      await user.save();
    }

    // Si el usuario en DB
    if (!user.status) {
      return res.status(401).json({
        msg: "Hable con el admnistrador, usuario bloqueado"
      });
    }

    // Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "token de Google no es valido"
    });
  }
};

module.exports = {
  login,
  renewToken,
  GoogleSignin
};
