// Arquivo para os endpoints das rodas. ass: lincolnn

import { Router } from "express"
import { isAdmin } from "./middlewares/isAdmin";
import { isAuthenticated } from "./middlewares/isAuthenticated";

import { ChangePasswordController } from "./controller/User/ChangePasswordController";
import { CreateClientController } from "./controller/Clients/CreateClientController";
import { DeleteClientController } from "./controller/Clients/DeleteClientController";
import { DetailClientController } from "./controller/Clients/DetailClientController";
import { UpdateClientController } from "./controller/Clients/UpdateClientController";
import { ListClientController } from "./controller/Clients/ListClientController";
import { CreateUserController } from './controller/User/CreateUserController';
import { DetailUserController } from "./controller/User/DetailUserController";
import { DeleteUserController } from "./controller/User/DeleteUserController";
import { UpdateUserController } from "./controller/User/UpdateUserController";
import { UpdateRoleController } from "./controller/User/UpdateRoleController";
import { AuthUserController } from "./controller/User/AuthUserController";
import { ListUserController } from "./controller/User/ListUserController";

import { createClientSchema, updateClientSchema } from "./schemas/clientSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { validateSchema } from "./middlewares/validateSchema";
import { changePasswordSchema } from "./schemas/userSchema";
import { updateUserSchema } from "./schemas/userSchema";
import { updateRoleSchema } from "./schemas/userSchema";


const changePasswordController = new ChangePasswordController();
const createClientController = new CreateClientController();
const detailClientController = new DetailClientController();
const updateClientController = new UpdateClientController();
const deleteClientController = new DeleteClientController();
const listClientController = new ListClientController();
const updateRoleController = new UpdateRoleController();
const deleteUserController = new DeleteUserController();
const listUserController = new ListUserController();
const router = Router();

router.post(
    '/users',
    validateSchema(createUserSchema),
    new CreateUserController().handle
  );

router.get(
    "/users",
    isAuthenticated,
    isAdmin,
    (req, res) => listUserController.handle(req, res)
  );

router.patch(
    "/users/:id/role",
    isAuthenticated,
    isAdmin,
    validateSchema(updateRoleSchema),
    (req, res) => updateRoleController.handle(req, res)
  );
  
router.delete(
    "/users/:id",
    isAuthenticated,
    isAdmin,
    (req, res) => deleteUserController.handle(req, res)
  );

router.post(
    '/session', 
    validateSchema(authUserSchema), 
    new AuthUserController().handle
   );

router.get(
    '/me',
    isAuthenticated,
    new DetailUserController().handle
   );

router.put(
    "/me",
    isAuthenticated,
    validateSchema(updateUserSchema),
    new UpdateUserController().handle
  );

router.patch(
    "/me/Changepassword",
    isAuthenticated,
    validateSchema(changePasswordSchema),
    (req, res) => changePasswordController.handle(req, res)
  );


// parte dos clientes -_-

router.post(
  "/clients", 
  isAuthenticated, 
  validateSchema(createClientSchema), 
  (req, res) => createClientController.handle(req, res)
);

router.get(
  "/clients",
  isAuthenticated, 
  (req, res) => listClientController.handle(req, res)
);

router.get(
  "/clients/:id", 
  isAuthenticated, 
  (req, res) => detailClientController.handle(req, res)
);

router.put("/clients/:id", 
  isAuthenticated, 
  validateSchema(updateClientSchema), 
  (req, res) => updateClientController.handle(req, res)
);

router.delete(
  "/clients/:id", 
  isAuthenticated, 
  isAdmin, 
  (req, res) => deleteClientController.handle(req, res)
);

export { router };
