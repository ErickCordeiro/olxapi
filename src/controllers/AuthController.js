import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult, matchedData } from "express-validator";
import User from "../models/User.js";
import State from "../models/State.js";
import Jwt from "jsonwebtoken";

const signin = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({
            error: errors.mapped()
        })
    }

    const data = matchedData(req);

    const user = await User.findOne({
        email: data.email
    });

    if(!user){
        return res.status(404).json({
            error: true,
            message: "Usuário e/ou senhas incorretos, verifique!"
        });
    }

    const match = await bcrypt.compare(data.password, user.password);

    if(!match){
        return res.status(404).json({
            error: true,
            message: "Usuário e/ou senhas incorretos, verifique!"
        });
    }

    const token = Jwt.sign(
        { id:user.id, email:user.email},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: 21600 //15 days
        }
    );

    user.token = token;
    await user.save();

    return res.status(200).json({
        token, email: data.email, name: user.name
    });
};

const signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({
            error: errors.mapped()
        })
    }

    const data = matchedData(req);

    const user = await User.findOne({
        email: data.email
    })

    if(user){
        return res.status(404).json({ 
            error: {
                email: {
                    msg: "E-mail já existe existente em nossa base de dados"
                }
            }
        })
    }

    if(!mongoose.Types.ObjectId.isValid(data.state)){
        return res.status(404).json({ 
            error: {
                state: {
                    msg: "O código do estado é inválido"
                }
            }
        })  
    }

    const state = await State.findById(data.state);
    if(!state) {
        return res.status(404).json({ 
            error: {
                state: {
                    msg: "O estado informado não existe na base de dados"
                }
            }
        })
    }

    const passHash = await bcrypt.hash(data.password, 10);

    const newUser = new User({
        name: data.name,
        email: data.email,
        password: passHash,
        state: data.state,
    })

    await newUser.save();

    return res.status(200).json({
        success: true, 
        message: "Registro efetuado com sucesso!"
    })
};

export default {
    signin,
    signup
}