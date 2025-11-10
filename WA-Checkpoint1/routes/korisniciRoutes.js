import express from 'express';
import { korisnici } from '../mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(korisnici);
})
router.post('/', (req, res) => {
    const zadnjiKorisnik = korisnici[korisnici.length - 1];
    const novaOmiljenaPutovanja = [...zadnjiKorisnik.omiljenaPutovanja];

    const noviKorisnik = {
        id: korisnici.length + 1,
        ...req.body,
        omiljenaPutovanja: novaOmiljenaPutovanja
    };

    korisnici.push(noviKorisnik);
    res.status(201).json(noviKorisnik);
})
router.delete('/', (req, res) => {
    const izbrisaniKorisnici = [];
    let index = korisnici.findIndex(k => k.omiljenaPutovanja.length < 3);
    while(index !== -1) {
        izbrisaniKorisnici.push(korisnici.splice(index, 1)[0]);
        index = korisnici.findIndex(k => k.omiljenaPutovanja.length < 3);
    }
    res.status(200).json(izbrisaniKorisnici);
});
export default router;