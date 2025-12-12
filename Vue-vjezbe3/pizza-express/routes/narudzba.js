import express from 'express';
import { narudzbe, pizze } from '../data/data.js'; 
const router = express.Router();

router.post('/', (req, res) => {
    console.log('Primljeni podaci narudžbe:', req.body);
    const { narucene_pizze, podaci_dostava } = req.body;
    if (!narucene_pizze || narucene_pizze.length === 0) {
        return res.status(400).json({ message: 'Nisu specificirane naručene pizze.' });
    }
    let ukupna_cijena = 0;
    for (const narucena of narucene_pizze) {
        const pizza = pizze.find(p => p.naziv.toLowerCase() ===
        narucena.naziv.toLowerCase());
        if (!pizza) {
            return res.status(400).json({ message: `Pizza s nazivom '${narucena.naziv}'
            nije dostupna.` });
        }
        const cijena = pizza.cijene[narucena.velicina.toLowerCase()];
        if (!cijena) {
            return res.status(400).json({ message: `Veličina '${narucena.velicina}' nije
            dostupna za pizzu '${narucena.naziv}'.` });
        }
        ukupna_cijena += cijena * narucena.kolicina;
    }
    ukupna_cijena = Number(ukupna_cijena.toFixed(2)); 
    res.status(201).json({
        message: 'Narudžba zaprimljena!',
        ukupna_cijena,
        narucene_pizze,
        podaci_dostava
    })
});
export default router;