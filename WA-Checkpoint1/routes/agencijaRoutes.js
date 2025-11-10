import express from 'express';
import { agencije } from '../mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(agencije);
})
router.get('/:id', (req, res) => {
    const agencija = agencije.find(a => a.id === parseInt(req.params.id))
    agencija ? res.json(agencija) : res.status(404).json({ greška: 'Agencija nije pronađena' });
})
router.post('/', (req, res) => {
    const novaAgencija = { id: agencije.length + 1, ...req.body};
    agencije.push(novaAgencija);
    res.status(200).json(novaAgencija);
})
router.patch('/:id', (req, res) => {
    const idAgencije = parseInt(req.params.id, 10);
    const { novoImeAgencije } = req.body;
    
    if(!novoImeAgencije) {
        return res.status(400).json({ greška: 'Nedostaje novo ime agencije' });
    }
    const agencija = agencije.find(a => a.id === idAgencije);
    if (!agencija) {
        return res.status(404).json({ greška: 'Agencija nije pronađena' });
    }

    agencija.ime = novoImeAgencije;
    res.json(agencija)
})

export default router;