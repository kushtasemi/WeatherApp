const express = require('express');
const path = require('path');
const hbs = require('hbs');
const { geocode, forecast } = require('./utils/utils');

const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../templates/views');
const partialsDir = path.join(__dirname, '../templates/partials');

const app = express();

app.use(express.static(publicDir));

app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerPartials(partialsDir);

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Weather App',
        name: 'Semi',
        surname: 'Kushta',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Semi',
        surname: 'Kushta',
    });
});

app.get('/about/*' , (req, res) => {
    res.render('about', {
        name: 'Semi',
        surname: 'Kushta',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        name: 'Semi',
        surname: 'Kushta',
    });
});

app.get('/weather', ((req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address' });
    }

    geocode(req.query.address, (error, data, message) => {
        if (error) {
            return res.send({error: error, message: message});
        }

        forecast({ latitude: data.latitude, longitude: data.longitude}, (error, forecastData) => {
            if (error) {
                return res.send({ error: error });
            }

            return res.send({ forecast: forecastData, location: data.location, address: req.query.address });
        });
    });
}));

app.get('*' , (req, res) => {
    res.send('Not found');
});

app.listen(3000, () => {
    console.log('Server running at port 3000');
});
