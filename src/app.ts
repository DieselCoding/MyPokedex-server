import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import DataBase from './db/mongo.db';
import ControllerInterface from './interface/controller.interface';
import errorMiddleware from './middleware/error.middleware';

const options: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    // methods: 'GET,PUT,POST',
    origin: '*',
    preflightContinue: false,
};

class App {

    public app: express.Application;
    private db: DataBase;

    constructor(controllers: ControllerInterface[]) {
        this.app = express();
        this.db = new DataBase();

        this.initializeMiddleware();
        this.initializeDataBase();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        // @ts-ignore
        this.app.listen(process.env.PORT, (err: ErrorRequestHandler) => {
            if (err) {
                return console.log(err);
            }
            console.log('Express server listening on port ' + process.env.PORT);
        });
    }

    private initializeMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        // this.app.use(morgan('dev'));
        this.app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        })
    }

    private initializeDataBase(): void {
        this.db.connect();
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: ControllerInterface[]): void {
        express.Router().use(cors(options));
        controllers.forEach((controller) => {
            this.app.use('/rest', controller.router);
        });
    }
}

export default App;
