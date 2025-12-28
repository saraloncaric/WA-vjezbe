import express from 'express';
import { narudzbe, pizze } from '../data/data.js'; 
import { connectToDatabase } from '../db.js'; 
import { FindCursor } from 'mongodb';

const router = express.Router();

let db = await connectToDatabase();

router.post('/', async (req, res) => {
    let kolekcija_narudzbi = db.collection('narudzbe');
    let kolekcija_pizza = db.collection('pizza');
    let nova_narudzba = req.body;

    let obvezni_kljucevi = ['ime', 'adresa', 'telefon', 'narucene_pizze'];

    if (!obvezni_kljucevi.every(kljuc => kljuc in nova_narudzba)) {
        return res.status(400).json({ error: 'Nedostaju obvezni kljucevi'});
    }
    let telefon = nova_narudzba.telefon.toString();
    let ispravno = telefon.length > 0 && telefon.split('').every(znak => {
        return znak >= '0' && znak <= '9';
    });
    if (!ispravno) {
        return res.status(400).json({ error: 'Telefon mora biti broj ili string koji sadrži samo brojeve' });
    }
    if(!Array.isArray(nova_narudzba.narucene_pizze) || nova_narudzba.narucene_pizze.length === 0) {
        return res.status(400).json({ error: 'Narucene pizze mora biti lista'});
    }

    let obvezni_kljucevi_narudzbe = ['naziv', 'kolicina', 'velicina'];
    for (let stavka of nova_narudzba.narucene_pizze) {
        if(!obvezni_kljucevi_narudzbe.every(kljuc => kljuc in stavka)) {
            return res.status(400).json({ error: 'Nedostaju obvezni kljucevi u narudzbi'});
        }
        if(!Number.isInteger(stavka.kolicina) || stavka.kolicina < 0) {
            return res.status(400).json({ error: 'Kolicina naručenih pizza mora biti veća od 0'});
        }
        if(!['mala', 'srednja', 'jumbo'].includes(stavka.velicina)) {
            return res.status(400).json({ error: 'Velicina pizze moze biti mala, srednja ili jumbo'});
        }
    }
    try {
        let dostupno = await kolekcija_pizza.find().toArray();
        if(!nova_narudzba.narucene_pizze.every(stavka => dostupno.some(pizza => pizza.naziv === stavka.naziv))) {
            return res.status(400).json({ error: 'Odabrana pizza ne postoji'});
        }
        let ukupna_cijena = 0;
        for (let stavka of nova_narudzba.narucene_pizze) {
            let pizza = dostupno.find(p => p.naziv === stavka.naziv);
            let cijena_komad = pizza.cijene[stavka.velicina];
            if(cijena_komad === undefined) {
                return res.status(400).json({ error: 'Cijene pizze nisu definirane'});
            }
            ukupna_cijena +=cijena_komad * stavka.kolicina;
        }
        nova_narudzba.ukupna_cijena = ukupna_cijena;
        let gotova_narudzba = await kolekcija_narudzbi.insertOne(nova_narudzba);
        res.status(201).json({ 
            insertedId: gotova_narudzba.insertedId, 
            ukupna_cijena: ukupna_cijena
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Greska na serveru' });
    }
});
export default router;