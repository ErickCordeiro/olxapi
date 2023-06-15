import { checkSchema } from 'express-validator';

const edit = checkSchema({
    name: {
        trim: true,
        optional: true,
        isLength: {
            options: { min: 2 }
        },
        errorMessage: 'O Nome precisa ter pelo menos 2 caracteres'
    },
    email: {
        isEmail: true,
        optional: true,
        normalizeEmail: true,
        errorMessage: 'O Formato do E-mail esta inválido'
    },
    password: {
        isLength: {
            options: { min: 6, max: 12 }
        },
        trim: true,
        optional: true,
        errorMessage: 'A senha precisa conter de 6 a 12 dígitos'
    },
    state: {
        notEmpty: true, 
        optional: true,
        errorMessage: 'Estado não foi informado.'
    }
});

export default {
    edit,
}