import express from 'express';
import { arrays_are_same } from './helpers/index.js';
import pizzeRouter from './app/routes/pizze.js';

const app = express()

app.use(express.json());

const PORT = 3000;

const pizze = [
    { 
        id: 1, 
        naziv: 'Margherita', 
        cijena: 6.5 
    },
    { 
        id: 2, 
        naziv: 'Capricciosa', 
        cijena: 8.0 
    },
    { 
        id: 3, 
        naziv: 'Quattro formaggi', 
        cijena: 10.0 
    },
    { 
        id: 4, 
        naziv: 'Šunka sir', 
        cijena: 7.0 
    },
    { 
        id: 5, 
        naziv: 'Vegetariana', 
        cijena: 9.0 
    }
];

app.get('/pizze', (req, res) => {
    res.json(pizze).status(200);
})
app.get('/pizze/:naziv', (req, res) => {
    const naziv_pizza = req.params.naziv;

    const trazena_pizza = pizze.find(pizze => pizze.naziv === naziv_pizza);

    if(!trazena_pizza) {
        return res.json({ greska: 'Pizza ne postoji'}).status(404);
    }
    return res.json(trazena_pizza).status(200);
})
app.post('/pizze', (req, res) => {
    const nova_pizza = req.body;
    const naziv_nove_pizze = req.body.naziv;

    const dozvoljeni_kljucevi = ['naziv', 'cijena']

    const nova_pizza_klucevi = Object.keys(nova_pizza); //vraca array

    if(!arrays_are_same(nova_pizza_klucevi, dozvoljeni_kljucevi)) {
        return res.status(400).json({ Greska: 'Kljucevi nisu ok'})
    }

    let postoji = pizze.find(pizza => pizza.naziv === naziv_nove_pizze);
    if(postoji) {
        return res.status(400).json({ Greska: `Pizza s azivom ${naziv_nove_pizze} vec postoji`});
    }

    let novi_id = pizze.at(-1)['id'] +1;
    let novi_zapis = {
        id: novi_id,
        naziv: nova_pizza.naziv, 
        cijena: nova_pizza.cijena
    };
    //ili spread operator(...)=> pizze.push({ id: novi_id, ...nova_pizza });

    pizze.push(nova_pizza);
    return res.json(pizze).status(201);
})

app.listen(PORT, (error) => {
    if (error) {
        console.log('Greska pri pokretanu')
    }
    console.log(`Posluzitelj radi na portu ${PORT}`);
})