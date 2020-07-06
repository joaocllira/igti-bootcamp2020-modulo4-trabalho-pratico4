import mongoose from 'mongoose';
import config from './config.js';

export const connectDB = () => {
    mongoose.connect(config.dbUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    console.log('Attempting to connect to DB');
    const db = mongoose.connection;
    
    try {
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log('Connected to DB');
        });
    } catch(error) {
        console.log(error)
    }
}

export const getConnection = () => {
    return mongoose.connection;
}