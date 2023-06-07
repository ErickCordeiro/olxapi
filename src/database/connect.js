import dotenv from 'dotenv';
import {connect} from 'mongoose';

dotenv.config();

export const mongoConnect = async () => {
    try {
        await connect(process.env.MONGO_URL, {
            useUnifiedTopology: true
        })
    } catch(error){
        console.log("Connection error: " + error);
    }
}