import express from 'express';
const router = express.Router();
import ControllerTasks from '../controllers/controllerTasks.js';
import jwt from "../helper/jwt.js";
import Role from "../helper/role.js";
import { hitProductAll } from '../middlewares/redis.js';
import { validateData } from '../middlewares/validationUserSchema.js';
import { userCreateSchema } from '../helper/userSchema.js';

router.get('/rate-limit-3', ControllerTasks.listen);
router.post('/authenticate', ControllerTasks.authentication);
router.get('/', jwt([Role.Manager]), ControllerTasks.getAll);
router.get('/history', jwt([Role.Admin]), ControllerTasks.getAllHistory);
router.get('/filter', ControllerTasks.getAllWithPaginationAndFilter);
router.post('/create', validateData(userCreateSchema), ControllerTasks.create);
router.get('/cache/:id', jwt([Role.Manager]), hitProductAll, ControllerTasks.getOne);
router.put('/:id', jwt([Role.Manager]), ControllerTasks.update);
router.delete('/:id', jwt([Role.Manager]), ControllerTasks.delete);

export default router;
