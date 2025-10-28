import express from 'express';
const router = express.Router();
import ControllerUsers from '../controllers/controllerUsers.ts';

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', ControllerUsers.getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', ControllerUsers.getOne);

router.put('/:id', ControllerUsers.update);
router.delete('/:id', ControllerUsers.delete);

export default router;
