import { NextFunction, Request, Response, Router } from 'express';
import { WrongCredentialsException } from '../../exception/http.exception';
import ControllerInterface from "../../interface/controller.interface";
import AuthenticationService from "./authentication.service";
import UserModel from '../user/user.model';
import ValidationMiddleware from "../../middleware/validation.middleware";
import AuthDto from "./auth.dto";
import UserDto from "../user/user.dto";
import generatePassword from "../../utils/generatePassword";

class AuthenticationController implements ControllerInterface {
    public path: string = '/auth';
    public router: Router = Router();
    public authenticationService = new AuthenticationService();
    private user = UserModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, ValidationMiddleware(UserDto), this.registration.bind(this));
        this.router.post(`${this.path}/login`, ValidationMiddleware(AuthDto), this.loggingIn.bind(this));
        this.router.post(`${this.path}/logout`, AuthenticationController.loggingOut.bind(this));
    }

    private async registration(request: Request, response: Response, next: NextFunction) {
        const userData: UserDto = request.body;
        try {
            const {
                cookie,
                user,
            } = await this.authenticationService.register(userData);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    }

    private async loggingIn(request: Request, response: Response, next: NextFunction) {
        const logInData: AuthDto = request.body;
        const user = await this.user.findOne({ email: logInData.email });
        if (user) {
            const pass = generatePassword(logInData.password, user.salt);
            const isPasswordMatching = pass === user.password;
            if (isPasswordMatching) {
                // @ts-ignore
                user.password = undefined;
                // @ts-ignore
                user.salt = undefined;
                const tokenData = AuthenticationService.createToken(user);
                response.setHeader('Authentication', tokenData.token);
                response.setHeader('ExpiresIn', tokenData.expiresIn);
                response.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private static loggingOut(response: Response) {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    }
}

export default AuthenticationController;
