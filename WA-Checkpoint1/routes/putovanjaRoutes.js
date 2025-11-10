import express from 'express';
import { putovanja } from '../mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(putovanja);
})
router.get('/:destinacija', (req, res) => {
    const destinacija = req.params.destinacija.toLowerCase();
    const putovanje = putovanja.find(p => p.destinacija.toLowerCase() === destinacija);
    putovanje ? res.json(putovanje) : res.status(404).json({ greška: 'Destinacija nije pronađena' });
})
router.post('/', (req, res) => {
    const novoPutovanje = { id: putovanja.length + 1, ...req.body};
    putovanja.push(novoPutovanje);
    res.status(200).json(novoPutovanje);
})
router.delete('/:destinacija', (req, res) => {
    const putovanjeBrisanje = req.params.destinacija;

    const indexPutovanja = putovanja.findIndex(putovanje => putovanje.destinacija === putovanjeBrisanje);
    if(indexPutovanja == -1) {
        return res.status(400).json({ poruka: 'Destinacija nije pronađena'});
    }
    const brisanjePutovanja = putovanja.splice(indexPutovanja, -1);
    return res.status(200).json({ rezultat: brisanjePutovanja })
})
router.put('/:id', (req, res) => {
    const putovanjeId = parseInt(req.params.id);
    const { destinacija, drzava, budzet, opis, agencija } = req.body;

    const index = putovanja.findIndex(putovanje => putovanje.id === putovanjeId);
    if (index === -1) {
        return res.status(400).json({ greska: 'Putovanje ne postoji' });
    }

    putovanja.splice(index, 1, {
        id: putovanjeId,
        destinacija,
        drzava,
        budzet,
        opis,
        agencija
    });

    return res.status(200).json({ message: 'Putovanje ažurirano', putovanje: putovanja[index] });
});

export default router;