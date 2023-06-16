import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const modelSchema = mongoose.Schema({
    userId: String, 
    state: String, 
    category: String, 
    images: [Object],
    createdAt: Date, 
    title: String,
    slug: String, 
    price: Number, 
    priceNegotible: Boolean, 
    description: String,
    views: Number,
    status: String
});

const modelName = 'Ad';
let myModel;

try {
    myModel = mongoose.model(modelName);
} catch (error) {
    myModel = mongoose.model(modelName, modelSchema);
}

export default myModel;