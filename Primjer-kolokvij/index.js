import express from 'express';
import path from 'path';
import boatsRouter from './routes/boatsRoutes.js';
import rentalsRouter from './routes/rentalsRoutes.js'

const app = express();
app.use(express.json());

app.use('/boats', boatsRouter);
app.use('/rentals', rentalsRouter);

const PORT = 3000;

let relativna = path.join('public', 'index.html');
let apsolutna = path.resolve(relativna);

app.listen(PORT, (error) => {
    if (error) {
        console.log('Greska pri pokretanu')
    }
    console.log(`Posluzitelj radi na portu ${PORT}`);
})


/* index.js prije router promjene
import express from 'express';
import path from 'path';

const app = express();

app.use(express.json());
const PORT = 3000;

let relativna = path.join('public', 'index.html');
let apsolutna = path.resolve(relativna);

const boats = [
    {
        id: 1,
        naziv: "Neverin",
        tip: "Jedrilica",
        duljina: 12,
        cijenaPoDanu: 250,
        motor_hp: 50
    },
    {
        id: 2,
        naziv: "Wave Rider",
        tip: "Motorni brod",
        duljina: 7,
        cijenaPoDanu: 200,
        motor_hp: 150
    },
    {
        id: 3,
        naziv: "Fisherman Bellingardo",
        tip: "Motorni brod",
        duljina: 5,
        cijenaPoDanu: 100,
        motor_hp: 70
    }
]
app.get('/', (req, res) => {
    res.status(200).sendFile(apsolutna);
}) 
app.get('/', (req,res) => {
    res.status(200).json({ message: 'Welcome to Rent-a-Boat API! How can I help you?' });
}) 
app.get('/boats', (req, res) => {
    if(!boats) {
        return res.status(404).json({ greska: 'Nema brodova'});
    } else {
        return res.status(200).json(boats);
    }
})
app.get('/boats/:naziv', (req, res) => {
    const naziv_broda = req.params.naziv;
    const brod = boats.find(boat => boat.naziv.toLowerCase() == naziv_broda.toLowerCase());

    if(!brod) {
        return res.status(404).json({ greska: `Nema broda ${naziv_broda}`});
    } else {
        return res.status(200).json(brod);
    }
})
app.post('/boats', (req, res) => {
    const novi_brod = req.body;
    const naziv_novog_broda = req.body.naziv;

    let postoji = boats.find(boat => boat.naziv == naziv_novog_broda);
    if(postoji) {
        return res.status(404).json({ greska: `Brod ${naziv_novog_broda} već postoji`});
    } 

    let novi_id = boats.length +1;
    boats.push({id: novi_id, ...novi_brod})
    return res.status(200).json(boats);
})

app.listen(PORT, () => {
    console.log(`Posluzitelj radi na portu ${PORT}`);
})
*/