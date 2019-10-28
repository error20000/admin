
const elEn = require('element-ui/lib/locale/lang/en');

const en = Object.assign({
    name: "English",
    login: {
        rules:{
            username: "please ineter username.",
            password: "please ineter password.",
        }
    }
}, elEn.default);

module.exports = en;