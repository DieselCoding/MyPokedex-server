import App from './app';
import AuthenticationController from './model/auth/auth.controller';
import './utils/config';
import validateEnvironments from './utils/environments';

validateEnvironments();

const app = new App([
    new AuthenticationController(),
]);

app.listen();
