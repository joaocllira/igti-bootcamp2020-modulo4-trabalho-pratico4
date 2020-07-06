import express from 'express';
import routes from './routes.js';
import { connectDB } from './db.js';

connectDB();

var app = express();

app.use(express.json());
app.use('/accounts', routes);

app.listen(3333, function () {
    console.log('Servidor rodando na porta 3333!');
});