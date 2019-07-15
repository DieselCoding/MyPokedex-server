import ControllerInterface from "../../interface/controller.interface";
import {Router} from "express";
import UserModel from './user.model';

class UserController implements ControllerInterface{
    public path: string = '/user';
    public router: Router = Router();
    private user = UserModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }
}
