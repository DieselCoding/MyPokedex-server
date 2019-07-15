import chalk from 'chalk';
import mongoose from 'mongoose';

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

class DataBase {

    public options = {
        useNewUrlParser: true,
    };

    constructor() {
        this.initViewers();
    }

    public connect() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;
        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, this.options);
    }

    public initViewers() {
        mongoose.connection.on('connected', () => {
            // @ts-ignore
            console.log(connected('Mongoose default connection is open to ', process.env.MONGO_PATH));
        });

        mongoose.connection.on('error', (err) => {
            console.log(error('Mongoose default connection has occurred ' + err + ' error'));
        });

        mongoose.connection.on('disconnected', () => {
            console.log(disconnected('Mongoose default connection is disconnected'));
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log(termination('Mongoose default connection is disconnected due to application termination'));
                process.exit(0);
            });
        });
    }
}

export default DataBase;
