const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use(session({
    secret: 'autodeskforge',
    cookie: {
        httpOnly: true,
        secure: (process.env.NODE_ENV === 'production'),
        maxAge: 1000 * 60 * 60
    },
    resave: false,
    saveUninitialized: true
}));

app.use('/api/forge/oauth', require('./routes/oauth'));

app.use('/', express.static(path.join(__dirname, 'www')));
app.use('/', function(req, res, next) {
    res.sendFile('www/index.html', { root: __dirname });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

app.listen(PORT, () => {
    console.log(`Application started at http://localhost:${PORT}`)
});