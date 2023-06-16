import Category from '../models/Category.js';
import Ad from '../models/Ad.js'
import User from '../models/User.js';
import Helper from '../helpers/helpers.js';

const getCategories = async (req, res) => {
   const cats = await Category.find();

   let categories = [];

   for(let i in cats) {
      categories.push({
         ...cats[i]._doc, 
         img: `${process.env.BASE_URL}/images/${cats[i].slug}.png`
      });
   }

   return res.status(200).json({
      categories
   })
};

const index = async (req, res) => {
 
};

const show = async (req, res) => {
    
};

const store = async (req, res) => {
   let { title, price, priceneg, description, category } = req.body;
   const token = Helper.getToken(req);

   const user = await User.findOne({
      token
   }).exec();

   if(!title || !price || !category){
      return res.status(404).json({ 
         error: true,
         message: "Título, categoria e preço são obrigatório, por favor verifique!"
      });
   }

   price = Helper.formatNumber(price);

   try {
      const newAd = new Ad();
      newAd.status = true;
      newAd.userId = user._id;
      newAd.state = user.state;
      newAd.category = category;
      newAd.createdAt = new Date();
      newAd.title = title;
      newAd.slug = Helper.strToSlug(title);
      newAd.description = description;
      newAd.price = price;
      newAd.priceNegotible = (priceneg == 'true')? true: false;
      newAd.views = 0;

      if(req.files && req.files.img){
         if(req.files.img.lenght == undefined){
            if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)) {
               let url = Helper.saveImage(req.files.img.data);
               newAd.images.push({
                  url,
                  default: false
               });
            }
         } else {
            for(let i=0; i < req.files.img.lenght; i++) {
               if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img[i].mimetype)) {
                  let url = Helper.saveImage(req.files.img[i].data);
                  newAd.images.push({
                     url,
                     default: false
                  });
               }
            }
         }
      }

      if(newAd.images.length > 0) {
         newAd.images[0].default = true;
      }

      const info = await newAd.save();
      return res.status(201).json({info})
   } catch (error) {
      return new Error("ERROR: " + error.message);
   }
};

const update = async (req, res) => {
    
};

export default {
   getCategories,
   index, 
   show, 
   store, 
   update,
}