import { Request } from 'express';
import UserInterface from '../model/user/user.interface';

interface RequestWithUser extends Request {
  userRequest: UserInterface;
}

export default RequestWithUser;
