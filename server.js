require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
//new MongoDbStore(session);

const app = express();

const PORT = process.env.PORT || 3000;

// Database connection
const url = 'mongodb://localhost/pizza'
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connected failed...');
});

/*// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})*/

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: url,
        touchAfter: 24 * 3600
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24}
}));

app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.json());

// Global middlewares
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})


//set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
});
