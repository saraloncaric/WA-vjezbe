import express from 'express';
import { boats } from '../data/data.js';

const router = express.Router();

router.get('/', (req, res) => {
    if(!boats) {
        return res.status(404).json({ greska: 'Nema brodova'});
    } else {
        return res.status(200).json(boats);
    }
})
router.get('/:naziv', (req, res) => {
    const naziv_broda = req.params.naziv;
    const brod = boats.find(boat => boat.naziv.toLowerCase() == naziv_broda.toLowerCase());

    if(!brod) {
        return res.status(404).json({ greska: `Nema broda ${naziv_broda}`});
    } else {
        return res.status(200).json(brod);
    }
})
router.post('/', (req, res) => {
    const novi_brod = req.body;
    const naziv_novog_broda = req.body.naziv;

    const dozvoljeni_kljucevi = ['naziv', 'tip', 'duljina', 'cijenaPoDanu', 'motor_hp'];
    const poslani_kljucevi = Object.keys(req.body);
    if(poslani_kljucevi.length !== dozvoljeni_kljucevi.length) {
        return res.status(400).json({ greska: 'Kljucevi nisu ok'});
    }

    let postoji = boats.find(boat => boat.naziv == naziv_novog_broda);
    if(postoji) {
        return res.status(404).json({ greska: `Brod ${naziv_novog_broda} već postoji`});
    } 

    let novi_id = boats.length +1;
    boats.push({id: novi_id, ...novi_brod})
    return res.status(200).json(boats);
})
// ja sam dodala ova dva da ima svega
router.put('/:id', (req, res) => {
    const boat_id = req.params.id;
    const { naziv, tip, duljina, cijenaPoDanu, motor_hp } = req.body;

    const index = boats.findIndex(boat => boat.id == boat_id);
    if(index == -1) {
        return res.status(400).json({ greska: `Brod sa id-em ${boat_id} ne postoji`})
    }
    boats.splice(index, 1, {
        id: boat_id,
        naziv,
        tip,
        duljina, 
        cijenaPoDanu,
        motor_hp
    })
    return res.status(200).json({ poruka: 'Detalji broda azurirani', boats});
})
router.delete('/:id', (req, res) => {
    const id_boat = req.params.id;
    const pronadi_id = boats.findIndex(boat => boat.id == id_boat);
    if(!pronadi_id) {
        res.status(404).json({ greska: `Brod sa id-em ${id_boat} ne postoji`});
    } 
    boats.splice(pronadi_id, 1);
    return res.status(200).json({ 
        poruka: `Brod sa id-em ${id_boat} je obrisan`,
        boats: boats
    });
})

export default router;