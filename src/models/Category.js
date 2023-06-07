import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const modelSchema = mongoose.Schema({
    name: String,
    slug: String,
});

const modelName = 'Category';
let myModel;

try {
    myModel = mongoose.model(modelName);
} catch (error) {
    myModel = mongoose.model(modelName, modelSchema);
}

export default myModel;