import { v4 as uuid } from 'uuid';
import Jimp from 'jimp';

const getToken = (req) => {
    const [authType, token] = req.headers.authorization.split(' ');
    return token;
}

const formatNumber = (item) => {
    return parseFloat(item.replace(".", " ").replace(",", "."))
}

function strToSlug(text) {
    // Converter para minúsculas
    text = text.toLowerCase();
    
    // Substituir caracteres especiais e espaços por hífens
    text = text.replace(/[^\w\s-]/g, '');
    text = text.replace(/[\s]+/g, '-');
    
    return text;
}

const saveImage = async (buffer) => {
    let newImage = `${uuid()}.jpg`;
    let tmpImg = await Jimp.read(buffer);
    tmpImg.cover(500, 500).quality(80).write(`./public/images/ads/${newImage}}`);

    return newImage;
}

export default {
    getToken,
    formatNumber,
    strToSlug,
    saveImage
};