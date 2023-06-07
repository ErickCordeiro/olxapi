import States from '../models/State.js';

const getStates = async (req, res) => {
    let states = await States.find();
    return res.status(200).json(states);
};

const show = async (req, res) => {
    
};

const update = async (req, res) => {
    
};

export default {
    getStates,
    show,
    update
}