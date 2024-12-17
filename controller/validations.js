module.exports = {
    validatePassword: (password) => {
        const regex = /^\d+$/;
        return regex.test(password);
    }
};
