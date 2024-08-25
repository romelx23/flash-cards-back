const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("./user.model");
const { generarJWT } = require("../helpers");

const getUsers = async (req = request, res = response) => {
  try {
    // const { q, name = "No name", apikey, page = 1, limit = 10 } = req.query;
    const { limit = 10, desde = 0, search = "" } = req.query;
    const query = { status: true };

    if (search && search !== "null" && search !== "undefined") {
      console.log(search);
      query.name = { $regex: search, $options: "i" };
    }

    // const usuarios = await Usuario.find(query)
    //       .skip(Number(desde))
    //       .limit(Number(limite));

    // const total=await Usuario.countDocuments(query);

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(desde))
        .limit(Number(limit))
    ]);

    return res.status(200).json({
      ok: true,
      total,
      users
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador"
    });
  }
};

const getUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    return res.status(200).json({
      ok: true,
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador"
    });
  }
};

const createUser = async (req, res = response) => {
  try {
    // leer y parsear del body que me envien
    // const { name, email, password, rol } = req.body
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    // Verificar si el email existe
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El email ya esta registrado"
      });
    }

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    // Generar el JWT
    const token = await generarJWT(user.id);

    return res.status(201).json({
      ok: true,
      user,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador"
    });
  }
};

const updateUser = async (req = request, res = response) => {
  try {
    // capturando query params
    const { id } = req.params;

  const { _id, password, google, email, ...rest } = req.body; //eslint-disable-line

    // TODO validar contra bd
    if (password) {
    // encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      rest.password = bcryptjs.hashSync(password, salt);
    }

  const usuario = await User.findByIdAndUpdate(id, rest, { new: true }); //eslint-disable-line

    return res.status(200).json({
      msg: "put API - usuarioPut",
      usuario
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador"
    });
  }
};

const patchUser = (req, res = response) => {
  res.json({
    msg: "api patch"
  });
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  // const uid=req.uid;
  // console.log(uid);

  //* Fisiacamente lo borramos
  //* const usuario=await Usuario.findByIdAndDelete(id);

  const usuario = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
  // const usuarioAutenticado=req.usuario;

  res.json({
    usuario
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  patchUser,
  deleteUser
};
