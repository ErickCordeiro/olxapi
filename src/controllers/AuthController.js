import { validationResult, matchedData } from "express-validator";

const signin = async (req, res) => {

};

const signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({
            error: errors.mapped()
        })
    }

    const data = matchedData(req);

    return res.status(200).json({
        success: true, 
        message: "Registro efetuado com sucesso!",
        data
    })
};

export default {
    signin,
    signup
}