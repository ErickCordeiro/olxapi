import fs from 'fs';

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

const saveImage = (base64Data, fileName) => {
    const imagePath = `public/images/ads/${fileName}`;

    if (!fs.existsSync('public/images/ads')) {
        fs.mkdirSync('public/images/ads', { recursive: true });
    }

    const imageBuffer = Buffer.from(base64Data, 'base64');

    fs.access('public/images/ads', fs.constants.W_OK, (err) => {
        if (err) {
            console.error('O Node.js não tem permissão para escrever na pasta:', imagePath);
            return;
        }

        fs.writeFile(imagePath, imageBuffer, (err) => {
            if (err) {
                console.log('Erro ao salvar a imagem:', err);
                return;
            }
        });
    });

    return { img: imagePathWithExtension };
};

export default {
    getToken,
    formatNumber,
    strToSlug,
    saveImage
};