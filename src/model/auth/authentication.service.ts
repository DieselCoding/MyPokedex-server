import crypto from "crypto";
import TokenData from "../../interface/tokenData.interface";
import UserInterface from "../user/user.interface";
import UserDto from "../user/user.dto";
import UserModel from '../user/user.model';
import DataStoredInToken from "../../interface/dataStoredInToken.interface";
import {UserWithThatEmailAlreadyExistsException} from "../../exception/http.exception";
import generatePassword from "../../utils/generatePassword";

class AuthenticationService {
    public static createCookie(tokenData: TokenData): string {
        return `{ "authorization" : "${tokenData.token}"; "Max-Age" : ${tokenData.expiresIn}}`;
    }
    public static createToken(user: UserInterface): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            // @ts-ignore
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
    public user = UserModel;

    public async register(userData: UserDto) {
        if (await this.user.findOne({ email: userData.email })) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const salt = crypto.randomBytes(64).toString('base64');
        const hashedPassword = generatePassword(userData.password, salt);
        const user = await this.user.create({
            ...userData,
            salt,
            password: hashedPassword,
        });

        // @ts-ignore
        user.salt = undefined;
        // @ts-ignore
        user.password = undefined;

        const tokenData = AuthenticationService.createToken(user);
        const cookie = AuthenticationService.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }
}

export default AuthenticationService;
