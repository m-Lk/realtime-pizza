const Menu = require('../../models/menu');

function homeController() {
    return {
        async index(req, res) {
            //Menu.find().then((pizzas) => {
            //    console.log(pizzas);
            //    return res.render('home', { pizzas });
            //})

            const pizzas = await Menu.find();
            return res.render('home', { pizzas });
        }
    }
}

module.exports = homeController;