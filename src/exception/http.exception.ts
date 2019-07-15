export class HttpException extends Error {
    public status: number;
    public message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class AuthenticationTokenMissingException extends HttpException {
    constructor() {
        super(401, 'Authentication token missing');
    }
}

export class UserWithThatEmailAlreadyExistsException extends HttpException {
    constructor(email: string) {
        super(400, `User with email ${email} already exists`);
    }
}

export class WrongAuthenticationTokenException extends HttpException {
    constructor() {
        super(401, 'Wrong authentication token');
    }
}

export class WrongCredentialsException extends HttpException {
    constructor() {
        super(401, 'Wrong credentials provided. You shall not pass!');
    }
}
