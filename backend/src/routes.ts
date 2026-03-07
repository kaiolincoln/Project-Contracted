// Arquivo para os endpoints das rodas. ass: lincolnn

import { Router } from "express"
import { CreateUserController } from './controller/user/CreateUserController';
import { AuthUserController } from "./controller/user/AuthUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";

const router = Router();

router.post(
    '/users',
    validateSchema(createUserSchema),
    // arquivo de valicao ---- viewer, admin, editor
    new CreateUserController().handle
  );

  router.post(
    '/session', 
    validateSchema(authUserSchema), 
    new AuthUserController().handle
   );

export { router };
