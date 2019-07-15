import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exception/http.exception';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const date = new Date();
    console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} : ${message}`);
    response
        .status(status)
        .send({
            status,
            message,
        });
    next();
}

export default errorMiddleware;
