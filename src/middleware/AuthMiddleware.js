import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const Auth = {
    private: async (req, res, next) => {
        let success = false;

        if(req.headers.authorization){
            try {
                const [authType, token] = req.headers.authorization.split(' ');
                if(authType === 'Bearer'){
                    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
                    success = true;
                }                   
            } catch (error) {
                return res.status(403).json({message: error.message});
            }
        }

        if(!success) {
            return res.status(403).json({
                error: true, 
                message:'Usuário não autorizado'
            });
        } else {
            next();
        }
    }
}