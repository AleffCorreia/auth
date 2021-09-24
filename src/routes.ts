import { Router } from 'express';
import UserController from './controllers/UserController';

const route = Router();
const userController = new UserController();

route.get('/users', userController.index);
route.post('/user', userController.create);

route.get('/users/:id', userController.show);
route.put('/users/:id', userController.update);
export default route;
