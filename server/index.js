const path = require("path");
const express = require("express");
const hbs = require('hbs')
const port = process.env.PORT
require("./db/mongoose");

const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const categoryRouter = require('./routers/category')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(bookRouter);
app.use(categoryRouter);

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Token-based auth',
        name: 'Mihai Ghe'
    })
})

app.get('/user', (req, res) => {
    
    res.render('user', {
        title: 'Account Control',
        name: 'Mihai Ghe'
    })
})

app.get('/book', (req, res) => {
    
    res.render('book', {
        title: 'My Books',
        name: 'Mihai Ghe'
    })
})

app.get('/createBook', (req, res) => {
    
    res.render('createBook', {
        title: 'My Books',
        name: 'Mihai Ghe'
    })
})

app.get('/category', (req, res) => {
    
    res.render('category', {
        title: 'My Books',
        name: 'Mihai Ghe'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        name: 'Mihai Ghe',
        errorMessage: 'Thanks to whoever made this png!'
    })
})