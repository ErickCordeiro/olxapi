import fs from 'fs';
import path from 'path';

const getToken = (req) => {
    const [authType, token] = req.headers.authorization.split(' ');
    return token;
}

const formatNumber = (item) => {
    return parseFloat(item.replace(".", "").replace(",", "."))
}

function strToSlug(text) {
    // Converter para minúsculas
    text = text.toLowerCase();
    
    // Substituir caracteres especiais e espaços por hífens
    text = text.replace(/[^\w\s-]/g, '');
    text = text.replace(/[\s]+/g, '-');
    
    return text;
}

const saveImage = (images) => {
    const imagesPath = [];
    const defaultImage = false;
    const destinationFolder = 'public/images/ads';

    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
    }

    for(const image of images) {
        const imageSplit = image.split(';base64,');
        const decodedImage = Buffer.from(imageSplit[1], 'base64');
        const imageName = `image_${Date.now()}.jpg`;
        const imgPath = path.join(destinationFolder, imageName);



        fs.writeFile(imgPath, decodedImage, (error) => {
            if(error){
                console.log("Error: "+ error);
                return false;
            } 
        });

        imagesPath.push({ url: imageName, default: defaultImage }); 
    }

    imagesPath[0].default = true;       
    return imagesPath;
};

export default {
    getToken,
    formatNumber,
    strToSlug,
    saveImage
};