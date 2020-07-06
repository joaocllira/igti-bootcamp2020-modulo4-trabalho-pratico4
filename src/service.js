import { getConnection } from './db.js';
import { Account } from './schemas.js';

export const testarDB = () => {
    return getConnection();
}

export const checarSaldo = async (agencia, conta) => {
    let account = await Account.findOne({ agencia, conta }, (err, account) => {
        if (err) throw new Error('A conta informada não existe');
        console.log(account);
    });
    if (!account) {
        throw new Error('A conta informada não existe');
    }
    return account.balance;
}

export const realizarDeposito = async (agencia, conta, valor) => {
    let account = await Account.findOne({ agencia, conta }, (err, account) => {
        if (err) throw new Error('A conta informada não existe');
        console.log(account);
    });
    if (account) {
        account.balance += valor;
        await account.save((err, account) => {
            if (err) throw new Error('Erro ao salvar deposito');
            console.log(account);
        });
    } else {
        throw new Error('A conta informada não existe');
    }
    return account.balance;
}

export const realizarSaque = async (agencia, conta, valor) => {
    valor++;
    let account = await Account.findOne({ agencia, conta }, (err, account) => {
        if (err) throw new Error('A conta informada não existe');
        console.log(account);
    });
    if (account) {
        if (account.balance < valor) {
            throw new Error('A conta não possui saldo suficiente');
        }
        account.balance -= valor;
        await account.save((err, account) => {
            if (err) throw new Error('Erro ao salvar deposito');
            console.log(account);
        });
    } else {
        throw new Error('A conta informada não existe');
    }
    return account.balance;
}

export const encerrarConta = async (agencia, conta) => {
    const account = await Account.findOneAndDelete({ agencia, conta }).exec();
    
    if (account) {
        const accounts = await Account.find({ agencia }).exec();

        if (accounts) {
            return accounts.length;
        } else {
            return null;
        }
    } else {
        throw new Error('A conta informada não existe');    
    }
}

export const transferencia = async (contaOrigem, contaDestino, valor) => {
    const origem = await Account.findOne({ conta: contaOrigem }).exec();
    const destino = await Account.findOne({ conta: contaDestino }).exec();
    if (!origem) {
        throw new Error('Conta de origem não existe');
    }
    if (!destino) {
        throw new Error('Conta de destino não existe');
    }
    if (origem.agencia !== destino.agencia) {
        origem.balance -= 8;
    }
    origem.balance -= valor;
    if (origem.balance < 0) {
        throw new Error('Saldo insuficiente na conta de origem');
    }
    destino.balance += valor;
    await origem.save();
    await destino.save();
    return origem.balance;
}

export const mediaSaldo = async (agencia) => {
    const accounts = await Account.find({ agencia }).exec();
    if (!accounts || accounts.length <= 0) {
        throw new Error('Agência não encontrada');
    }
    const sum = accounts.reduce((acc, account) => acc += account.balance, 0);
    return (sum * 1.0) / accounts.length;
}

export const clientesPobres = async (qtde) => {
    const accounts = await Account.find({}).sort('balance').limit(parseInt(qtde)).exec();
    if (!accounts) {
        throw new Error('Erro ao buscar informações');
    }
    return accounts.map(acc => ({ agencia: acc.agencia, conta: acc.conta, saldo: acc.balance }));
}

export const clientesRicos = async (qtde) => {
    const accounts = await Account.find({}).sort([['balance', -1], ['name']]).limit(parseInt(qtde)).exec();
    if (!accounts) {
        throw new Error('Erro ao buscar informações');
    }
    return accounts.map(acc => ({ agencia: acc.agencia, conta: acc.conta, nome: acc.name, saldo: acc.balance }));
}

export const migrarPrivate = async () => {
    const agencies = await Account.distinct('agencia').exec();
    if (!agencies) {
        throw new Error('Erro ao buscar informações');
    }
    for (let i = 0; i < agencies.length; i++) {
        let account = await Account.findOne({agencia: agencies[i]}).sort([['balance', -1]]).limit(1).exec();
        account.agencia = 99;
        await account.save();
    }  
    return await Account.find({agencia: 99}).exec();
}
