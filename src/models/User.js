import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const modelSchema = mongoose.Schema({
    name: String, 
    email: String, 
    state: String, 
    password: String,
    token: String, 
});

const modelName = 'User';
let myModel;

try {
    myModel = mongoose.model(modelName);
  } catch (error) {
    myModel = mongoose.model(modelName, modelSchema);
  }

export default myModel;