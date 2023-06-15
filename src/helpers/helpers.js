const getToken = (req) => {
    const [authType, token] = req.headers.authorization.split(' ');
    return token;
}

export default {
    getToken
};