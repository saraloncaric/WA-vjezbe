import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/zaposlenici', async (req, res) => {
    try {
        const data = await fs.readFile('./data/zaposlenici.json', 'utf8');
        let zaposlenici = JSON.parse(data);
        if(!zaposlenici || zaposlenici.length === 0) {
            return res.status(404).json({ poruka: 'Nema zaposlenika'});
        }
        const { sortiraj_po_godinama, pozicija, godina_staža_min, godina_staža_max } = req.query;
        if(sortiraj_po_godinama) {
            if(sortiraj_po_godinama === 'uzlazno') {
                zaposlenici.sort((a, b) => a.godina_staža - b.godina_staža);
            }
            else if(sortiraj_po_godinama === 'silazno') {
                zaposlenici.sort((a, b) => b.godina_staža - a.godina_staža);
            }
        }
        if(pozicija) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.pozicija.toLowerCase() === pozicija.toLowerCase());
        }
        if(godina_staža_min) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.godina_staža >= parseInt(godina_staža_min));
        }
        if(godina_staža_max) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.godina_staža <= parseInt(godina_staža_max));
        }

        res.status(200).json(zaposlenici);
    } catch(error) {
        console.error('Greška:', error)
        res.status(500).json({ poruka: 'Greška prilikom čitanja datoteke'});
    }       
})
app.get('/zaposlenici/:id', async (req, res) => {
    try {
        const id_zaposlenika = req.params.id;
        if(isNaN(id_zaposlenika)) {
            return res.status(400).json({ poruka: 'ID mora biti broj'});
        }
        const data = await fs.readFile('./data/zaposlenici.json', 'utf8');
        const zaposlenici = JSON.parse(data);

        const zaposlenik = zaposlenici.find(zaposlenik => zaposlenik.id == id_zaposlenika);
        if(!zaposlenik) {
            return res.status(400).json({ poruka: `Zaposlenik sa id-em ${id_zaposlenika} ne postoji`});

        }
        res.status(200).json(zaposlenik);

    } catch(error) {
        console.error('Greška:', error);
        res.status(500).json({ poruka: 'Greška prilikom daohvata zaposlenika'});
    }
})
app.post('/zaposlenici', async(req, res) => {
    const { ime, prezime, godina_staža, pozicija } = req.body;
    if(!ime || !prezime || !godina_staža || !pozicija) {
        return res.status(400).send('Nedostaju podaci');
    }
    if(typeof ime !== 'string' || typeof prezime !== 'string' || typeof pozicija !== 'string') {
        return res.status(400).json({ poruka: 'Ime, prezime i poozicija moraju biti string'});
    }
    if(isNaN(godina_staža)) {
        return res.status(400).json({ poruka: 'Godina staža mora biti broj'});
    }
    try {
        const data = await fs.readFile('./data/zaposlenici.json', 'utf8');
        const zaposlenici = JSON.parse(data);
        
        const novi_zaposlenik = { id: zaposlenici.length + 1, ...req.body};
        zaposlenici.push(novi_zaposlenik);

        await fs.writeFile('./data/zaposlenici.json', JSON.stringify(zaposlenici));
        res.status(200).json(novi_zaposlenik);
    } catch(error) {
        console.error('Greška:', error);
        res.status(500).json({ poruka: 'Greška priliko pohrane u datoteku' });
    }
})

app.listen(PORT, () => {
    console.log(`Poslužitelj sluša na portu ${PORT}`)
})