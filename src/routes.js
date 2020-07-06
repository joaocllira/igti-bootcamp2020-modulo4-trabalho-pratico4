import express from "express";
import { testarDB, migrarPrivate, clientesPobres, clientesRicos, mediaSaldo, realizarDeposito, realizarSaque, checarSaldo, encerrarConta, transferencia } from "./service.js";

var routes = express.Router();

const formataNumero = (numero) => {
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
}

routes.get('/test-db', (request, response) => {
    try {
        const db = testarDB();

        return response.json({ db: db });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.get('/saldo', async (request, response) => {
    try {
        const { agencia, conta } = request.body;

        const balance = await checarSaldo(agencia, conta);

        return response.json({ balance: formataNumero(balance) });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.get('/media-saldo', async (request, response) => {
    try {
        const { agencia } = request.body;

        const media = await mediaSaldo(agencia);

        return response.json({ media: formataNumero(media) });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.post('/deposito', async (request, response) => {
    try {
        const { agencia, conta, valor } = request.body;

        if (valor <= 0) {
            throw new Error('Valor tem que ser maior que zero')
        }

        const balance = await realizarDeposito(agencia, conta, valor);

        return response.json({ balance: formataNumero(balance) });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.post('/saque', async (request, response) => {
    try {
        const { agencia, conta, valor } = request.body;

        if (valor <= 0) {
            throw new Error('Valor tem que ser maior que zero')
        }

        const balance = await realizarSaque(agencia, conta, valor);

        return response.json({ balance: formataNumero(balance) });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.delete('/encerrar-conta', async (request, response) => {
    try {
        const { agencia, conta } = request.body;

        const contasAtivas = await encerrarConta(agencia, conta);

        return response.json({ contasAtivas });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.post('/transferencia', async (request, response) => {
    try {
        const { contaOrigem, contaDestino, valor } = request.body;

        if (valor <= 0) {
            throw new Error('Valor tem que ser maior que zero')
        }

        const balance = await transferencia(contaOrigem, contaDestino, valor);

        return response.json({ balance: formataNumero(balance) });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.get('/clientes-pobres', async (request, response) => {
    try {
        const { qtde } = request.body;

        if (qtde <= 0) {
            throw new Error('Valor tem que ser maior que zero')
        }
        const clientes = await clientesPobres(qtde);

        return response.json({ clientes });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.get('/clientes-ricos', async (request, response) => {
    try {
        const { qtde } = request.body;

        if (qtde <= 0) {
            throw new Error('Valor tem que ser maior que zero')
        }
        const clientes = await clientesRicos(qtde);

        return response.json({ clientes });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

routes.post('/migrar-private', async (request, response) => {
    try {
        const clientes = await migrarPrivate();

        return response.json({ clientes });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

export default routes;