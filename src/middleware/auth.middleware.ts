import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exception/http.exception';
import DataStoredInToken from '../interface/dataStoredInToken.interface';
import RequestWithUser from '../interface/requestWithUser.interface';
import UserModel from '../model/user/user.model';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const data = request.headers.authentication;
  if (data) {
    const secret = process.env.JWT_SECRET;
    try {
      // @ts-ignore
      const verificationResponse = jwt.verify(data, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        request.userRequest = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
