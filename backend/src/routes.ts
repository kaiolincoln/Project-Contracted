// Arquivo para os endpoints das rodas. ass: lincolnn

import { Router } from "express"
import { CreateUserController } from './controller/user/CreateUserController';
import { validateSchema } from "./middlewares/validateSchema";
import { createUserSchema } from "./schemas/userSchema";

const router = Router();

router.post(
    '/users',
    validateSchema(createUserSchema),
    new CreateUserController().handle
  );

export { router };
