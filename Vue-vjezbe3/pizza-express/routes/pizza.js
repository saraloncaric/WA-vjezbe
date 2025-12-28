import express from 'express';
import { pizze } from '../data/data.js'; 
import { connectToDatabase } from '../db.js'; 
import { FindCursor } from 'mongodb';

const router = express.Router();

let db = await connectToDatabase();

router.get('/', async (req, res) => {
    let sve_pizze = db.collection('pizza');
    let sort_cijena = req.query.sort;
    let pretraga_naziv = req.query.naziv;
    let cijena_min = req.query.cijena_min;
    let cijena_max = req.query.cijena_max;
    try{
        let filter = {};
        if (pretraga_naziv) {
            filter.naziv = pretraga_naziv;
        }
        if (cijena_min || cijena_max) {
            let uvjeticijena = [];
            if (cijena_min) {
                const min = parseFloat(cijena_min);
                uvjeticijena.push({
                    $or: [
                        { 'cijene.mala': { $gte: min } },
                        { 'cijene.srednja': { $gte: min } },
                        { 'cijene.jumbo': { $gte: min } }
                    ]
                });
            }
            if (cijena_max) {
                const max = parseFloat(cijena_max);
                uvjeticijena.push({
                    $or: [
                        { 'cijene.mala': { $lte: max } },
                        { 'cijene.srednja': { $lte: max } },
                        { 'cijene.jumbo': { $lte: max } }
                    ]
                });
            }
            if (uvjeticijena.length > 0) {
                filter.$and = uvjeticijena;
            }
        }
        let sortirano = {};
        if (sort_cijena) {
            sortirano['cijene.mala'] = Number(sort_cijena);
        }
        
        let pizze = await sve_pizze
            .find(filter)
            .sort(sortirano)
            .toArray();

        if (pizze.length === 0) {
            return res.status(404).json({ message: 'Nema pizza koje odgovaraju kriterijima.' });
        }
        res.status(200).json(pizze);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Greska na serveru' });
    }
});
router.get('/:naziv', async (req, res) => {
    try{
        const naziv = req.params.naziv;
        const pizza = await db.collection('pizza').findOne({ naziv: naziv});
        if (!pizza) {
            return res.status(404).json({ message: `Pizza s nazivom '${naziv}' nije pronađena.` });
        }
        res.status(200).json(pizza);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Greska na serveru' });
    } 
});
router.post('/', async(req, res) => {
    const { naziv, sastojci, slika_url, cijene } = req.body;
    const kljucevi = ['naziv', 'sastojci', 'slika_url', 'cijene'];
    const poslani_kljucevi = Object.keys(req.body);
    const nedostaju_kljucevi = kljucevi.filter(kljuc => !poslani_kljucevi.includes(kljuc));
    if(nedostaju_kljucevi.length > 0) {
        return res.status(404).json({ message: 'Nedostaju obvezna polja'});
    }
    if(typeof naziv !== 'string') {
        return res.status(400).json({ message: 'Naziv mora biti string'});
    }
    if(!Array.isArray(sastojci) || sastojci.length === 0) {
        return res.status(400).json({ message: 'Sastojci moraju biti lista'});
    }
    const svi_sastojci = sastojci.filter(sastojak => typeof sastojak !== 'string');
    if(svi_sastojci.length > 0) {
        return res.status(400).json({ message: 'Sastojci pizze moraju biti stringovi'});
    }
    if(typeof slika_url !== 'string') {
        return res.status(400).json({ message: 'Slika mora biti string'});
    }
    if(typeof cijene !== 'object') {
        return res.status(400).json({ message: 'Cijene moraju biti objekt'});
    }
    const trazene_cijene = [ 'mala', 'srednja', 'jumbo'];
    const cijena = Object.keys(cijene);
    const sve_cijene = trazene_cijene.filter(c => !cijena.includes(c));
    if(sve_cijene.length > 0) {
        return res.status(400).json({ message: 'Nedostaju cijene pizze'});
    }
    try {
        const nova_pizza = await db.collection('pizza').insertOne(req.body);
        res.status(201).json(nova_pizza);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greska na serveru' });  
    }
})
export default router;