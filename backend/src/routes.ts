// Arquivo para os endpoints das rodas. ass: lincolnn

import { Router } from "express"
import { CreateUserController } from './controller/User/CreateUserController';
import { AuthUserController } from "./controller/User/AuthUserController";
import { DetailUserController } from "./controller/User/DetailUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { UpdateUserController } from "./controller/User/UpdateUserController";
import { updateUserSchema } from "./schemas/userSchema";
import { ChangePasswordController } from "./controller/User/ChangePasswordController";
import { changePasswordSchema } from "./schemas/userSchema";

const router = Router();
const changePasswordController = new ChangePasswordController();

router.post(
    '/users',
    validateSchema(createUserSchema),
    new CreateUserController().handle
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

export { router };
