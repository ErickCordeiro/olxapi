import mongoose from "mongoose";
import Category from "../models/Category.js";
import Ad from "../models/Ad.js";
import User from "../models/User.js";
import State from "../models/State.js";
import Helper from "../helpers/helpers.js";

const getCategories = async (req, res) => {
  const cats = await Category.find();

  let categories = [];

  for (let i in cats) {
    categories.push({
      ...cats[i]._doc,
      url: `${process.env.BASE_URL}/images/${cats[i].slug}.svg`,
    });
  }

  return res.status(200).json({
    categories,
  });
};

const index = async (req, res) => {
  let {
    sort = "asc",
    offset = 0,
    limit = 12,
    search,
    category,
    state,
  } = req.query;
  let filters = { status: true };
  let total = 0;

  if (search) {
    filters.title = { $regex: search, $options: "i" };
  }

  if (category) {
    const cat = await Category.findOne({ slug: category }).exec();
    if (cat) {
      filters.category = cat._id.toString();
    }
  }

  if (state) {
    const uf = await State.findOne({ name: state.toUpperCase() }).exec();
    if (uf) {
      filters.state = uf._id.toString();
    }
  }

  const adsTotal = await Ad.find(filters).exec();
  total = adsTotal.length;

  const adsData = await Ad.find(filters)
    .sort({ createdAt: sort == "desc" ? -1 : 1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .exec();

  let ads = [];

  for (let i in adsData) {
    let image;
    let imgDefault = adsData[i].images.find((el) => el.default);

    if (imgDefault) {
      image = `${process.env.BASE_URL}/images/ads/${imgDefault.url}`;
    } else {
      image = `${process.env.BASE_URL}/images/ads/default.jpg`;
    }

    ads.push({
      id: adsData[i].id,
      title: adsData[i].title,
      price: adsData[i].price,
      priceNegotible: adsData[i].priceNegotible,
      image,
    });
  }

  return res.status(200).json({ ads, total });
};

const show = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({
      error: true,
      message:
        "O Anúncio não esta em um formato válido, desculpe, volte novamente mais tarde!",
    });
  }

  const item = await Ad.findById(req.params.id);
  item.views++;
  await item.save();

  let images = [];
  for(let i in item.images){
    images.push(`${process.env.BASE_URL}/images/ads/${item.images[i].url}`);
  }

  if(images.length == 0){
    images.push(`${process.env.BASE_URL}/images/ads/default.jpg`);
  }

  let category = await Category.findById(item.category).exec();
  let userInfo = await User.findById(item.userId).exec();
  let stateInfo = await State.findById(item.state).exec();

  let other = [];
  let ads = await Ad.find({category: item.category}).limit(4).exec();

  for(let i in ads){
    if(ads[i]._id.toString() != item._id.toString()) {
      let image = `${process.env.BASE_URL}/images/ads/default.jpg`;

      let defaultImage = ads[i].images.find(el => el.default);
      if(defaultImage){
        image = `${process.env.BASE_URL}/images/ads/${defaultImage.url}`;
      }
  
      other.push({
        id: ads[i]._id,
        title: ads[i].title,
        price: ads[i].price,
        priceNegotible: ads[i].priceNegotible,
        image
      })
    }
  }


  return res.status(200).json({
    id: item._id,
    title: item.title,
    price: item.price,
    priceNegotible: item.priceNegotible,
    description: item.description,
    createdAt: item.createdAt,
    views: item.views,
    images,
    category,
    user: {
      name: userInfo.name,
      email: userInfo.email
    },
    state: stateInfo.name,
    other
  });
};

const store = async (req, res) => {
  try {
    let { title, price, priceneg, description, category, images } = req.body;
    const token = Helper.getToken(req);

    const user = await User.findOne({token}).exec();

    if (!title || !price || !category) {
      return res.status(404).json({
        error: true,
        message:
          "Título, categoria e preço são obrigatórios, por favor verifique!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(404).json({
        error: true,
        message:
          "A categoria informada não está em um formato válido, verifique",
      });
    }

    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(404).json({
        error: true,
        message:
          "A categoria não existe em nossa base de dados, verifique",
      });
    }

    price = Helper.formatNumber(price);

    const newAd = new Ad();
    newAd.status = true;
    newAd.userId = user._id;
    newAd.state = user.state;
    newAd.category = cat._id.toString();
    newAd.createdAt = new Date();
    newAd.title = title;
    newAd.slug = Helper.strToSlug(title);
    newAd.description = description;
    newAd.price = price;
    newAd.priceNegotible = priceneg == "true" ? true : false;
    newAd.views = 0;

    if (images && images.length > 0) {
      const imagePaths = Helper.saveImage(images);
      newAd.images = imagePaths;
    }

    const info = await newAd.save();
    return res.status(201).json({ info });
  } catch (error) {
    return new Error("ERROR: " + error.message);
  }
};

const update = async (req, res) => {
  const token = Helper.getToken(req);
  let { id } = req.params;
  let  { title, status, price, priceneg, description, category, images } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({
      error: true,
      message:
        "O Anúncio não esta em um formato válido, desculpe, volte novamente mais tarde!",
    });
  }

  const ad = await Ad.findById(id).exec();
  if (!ad) {
    return res.status(404).json({
      error: true,
      message:
        "O Anúncio não encontrado ou inexistente!",
    });
  }

  const user = await User.findOne({token: token}).exec();
  if(user._id.toString() !== ad.userId){
    return res.status(404).json({
      error: true,
      message:
        "O Anúncio não está vinculado ao seu usuário, verifique!",
    });
  }

  let updates = {};

  if(title){
    updates.title = title;
    updates.slug = Helper.strToSlug(title);
  }

  if(price) {
    price = Helper.formatNumber(price);
    updates.price = price;
  }

  if(priceneg){
    updates.priceNegotible = priceneg;
  }

  if(status) {
    updates.status = status == "on" ? true : false;
  }

  if(description) {
    updates.description = description;
  }

  if(category) {
    const cat = await Category.findOne({slug: category}).exec();
    if(!cat){
      return res.status(404).json({
        error: true,
        message:
          "A categoria que esta enviando não existe, verifique!",
      });
    }

    updates.category = cat._id.toString();
  }

  if(images) {
    updates.images = images;
  }

  await Ad.findByIdAndUpdate(id, {$set: updates});

  if (req.files && req.files.img) {
    const adI = await Ad.findById(id);

    if (req.files.img.lenght == undefined) {
      if (
        ["image/jpeg", "image/jpg", "image/png"].includes(
          req.files.img.mimetype
        )
      ) {
        let url = Helper.saveImage(req.files.img.data);
        newAd.images.push({
          url,
          default: false,
        });
      }
    } else {
      for (let i = 0; i < req.files.img.lenght; i++) {
        if (
          ["image/jpeg", "image/jpg", "image/png"].includes(
            req.files.img[i].mimetype
          )
        ) {
          let url = Helper.saveImage(req.files.img[i].data);
          newAd.images.push({
            url,
            default: false,
          });
        }
      }
    }

    adI.images = [...adI, images];
    await adI.save();
  }

  return res.status(200).json({
    success: true,
    message:
      "Parabéns! O seu anúncio foi atualizado com sucesso!",
  });
};

export default {
  getCategories,
  index,
  show,
  store,
  update,
};
