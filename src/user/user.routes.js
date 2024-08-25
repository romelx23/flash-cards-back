const { Router } = require("express");
const { body, check } = require("express-validator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("./user.controller");
const {
  // esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  esRoleValidoLocal
} = require("../helpers/db-validators");
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { tieneRole } = require("../middlewares/validar-roles");

const { validarJWT, tieneRole, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", [
  validarJWT,
  esAdminRole,
  validarCampos
],
getUsers);

router.get("/:id", getUser);

router.post(
  "/",
  [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("email", "El correo no es valido").isEmail().custom(emailExiste),
    body("password", "El password debe de ser más de 6 letras").isLength({
      min: 6
    }),
    // body('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
  ],
  createUser
);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    // check('role').custom(esRoleValido),
    check("role").custom(esRoleValidoLocal),
    validarCampos
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    tieneRole("ADMIN_ROLE"),
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos
  ],
  deleteUser
);

// router.patch('/', patchUser)

module.exports = router;
