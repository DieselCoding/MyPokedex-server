import { cleanEnv, port, str } from 'envalid';

function validateEnvironments() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
    });
}

export default validateEnvironments;
