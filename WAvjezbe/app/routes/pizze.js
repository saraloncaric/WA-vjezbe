import express from 'express';

const router = express.Router();

app.use('/pizze', pizzeRouter);

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

router.get('/', (req, res) => {
    res.json(pizze).status(200);
})

router.get('/:naziv', (req, res) => {

})
router.post('/', (req, res) => {

})

router.delete('/:naziv', (req, res) => {
    const pizza_za_brisanje = req.params.naziv;

    if(!isNaN(pizza_za_brisanje)) {
        return res.status(400).json({ Greska: 'Naziv nije string'})
    }

    let index_pizze = pizze.findIndex(pizza => pizza.naziv === pizza_za_brisanje);
    if(index_pizze == -1) {
        return res.status(404).json({ Greska: 'Pizza nije pronađena'});
    }
    let brisanje = pizze.splice(index_pizze, 1);

    return res.status(200).json({ rezultat: brisanje });
})

//HTTP PUT
router.put('/:naziv', (req, res) => {
    let trazena_pizza_naziv = req.params.naziv;
    let nova_pizza = req.body;

    let pizza_za_update = pizze.find(pizza => pizze.naziv === trazena_pizza_naziv)
    if(!pizza_za_update) {
        return res.status(404).json({ Greska: 'Ne postoji'});
    }
    let pizza_update_index = pizze.findIndex(pizza => pizza.naziv === trazena_pizza_naziv)

    pizze.splice(pizza_update_index, 1, nova_pizza);

    return res.status(200).send('OK');
})

//HTTP PATCH
router.patch('/:cijena',(req, res) => {
    let trazena_pizza_cijena = req.params.cijena;
    let nova_pizza_cijena = req.body;

    
})

export default router;