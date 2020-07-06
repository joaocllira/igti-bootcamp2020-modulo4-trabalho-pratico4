import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    agencia: { type: Number, required: true },
    conta: { type: Number, required: true },
    name: { type: String, required: true },
    balance: { type: Number, required: true, min: 0 },
});

export const Account = mongoose.model('Account', accountSchema);