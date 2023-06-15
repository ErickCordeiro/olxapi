import { validationResult, matchedData } from "express-validator";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

import States from '../models/State.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Ad from '../models/Ad.js';
import Helpers from '../helpers/helpers.js';


const getStates = async (req, res) => {
  let states = await States.find();
  return res.status(200).json(states);
};

const show = async (req, res) => {
  const token = Helpers.getToken(req);
  const user = await User.findOne({ token });
  const state = await States.findById(user.state);
  const ads = await Ad.find({userId: user._id.toString()});

  let listAds = [];

  for(let i in ads){
    const category = await Category.findById(ads[i].category);

    listAds.push({
      ...ads[i], 
      category: category.slug
    });
  }

  return res.status(200).json({
    name: user.name,
    email: user.email,
    state: state.name,
    ads: listAds
  });
};

const update = async (req, res) => {
  const errors = validationResult(req);
  const token = Helpers.getToken(req);

  if(!errors.isEmpty()){
      return res.status(404).json({
          error: errors.mapped()
      })
  }

  const data = matchedData(req);

  let fields = {};

  if(data.name){
    fields.name = data.name;
  }

  if(data.email){
    const emailCheck = await User.findOne({email: data.email});
    if(emailCheck){
      return res.status(404).json({
        error: true,
        message: `O E-mail (${data.email}) já existe em nossa base de dados!`,
      });
    }

    fields.email = data.email;
  }

  if(data.state){
    if(!mongoose.Types.ObjectId.isValid(data.state)){
      return res.status(404).json({
        error: true,
        message: 'O Estado não esta em um formato válido!',
      });
    }

    const stateCheck = await States.findById(data.state);
    if(!stateCheck){
      return res.status(404).json({
        error: true,
        message: 'O Estado não existe em nossa base de dados!',
      });
    }

    fields.state = data.state;
  }

  if(data.password){
    fields.password = await bcrypt.hash(data.password, 10);
  }

  await User.findOneAndUpdate({token}, {$set: fields});

  return res.status(200).json({
    success: true,
    message: "Usuário alterado com sucesso"
  })
};

export default {
  getStates,
  show,
  update
}