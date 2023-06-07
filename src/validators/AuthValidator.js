import { checkSchema } from 'express-validator';

signup: checkSchema({
    name: {
        trim: true,
        isLenght: {
            option: { min: 2}
        },
        errorMessage: 'O Nome precisa ter pelo menos 2 caracteres'
    },
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'O Formato do E-mail esta inválido'
    },
    password: {
        isLenght: {
            options: { min: 6, max: 12}
        },
        trim: true,
        errorMessage: 'A senha precisa conter de 6 a 12 dígitos'
    }
});

export default {
    signup,
}