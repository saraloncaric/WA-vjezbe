import express from 'express';
import { rentals } from '../data/rentals.js';
import { boats } from '../data/data.js';
import razlika_datuma from '../utils/razlikafunction.js'

const router = express.Router();

router.post('/', (req, res) => {
    const rental_podaci = req.body;
    const boat_id = req.body.boatId;

    let brod_postoji = boats.find(boat => boat.id == boat_id);
    if(!brod_postoji) {
        return res.status(404).json({greska: `Brod sa id-em ${boat_id} ne postoji`})
    }

    const { rentalStartDate, rentalEndDate } = req.body;

    if (new Date(rentalEndDate) < new Date(rentalStartDate)) {
        return res.status(400).json({ greska: 'Kraj ne moze biti prije pocetka najma'})
    }
    const razlika = razlika_datuma(rentalStartDate, rentalEndDate);
    const totalPrice = brod_postoji.cijenaPoDanu * razlika;
    
    const rentals_id = rentals.length +1;
    let novi_rental = {
        id: rentals_id,
        boatId: rental_podaci.boatId,
        customerName: rental_podaci.customerName,
        rentalStartDate: rental_podaci.rentalStartDate,
        rentalEndDate: rental_podaci.rentalEndDate,
        totalPrice: totalPrice,
    };
    rentals.push(novi_rental)
    return res.status(201).json(rentals);
})
router.patch('/:id', (req, res) => {
    const idRental = req.params.id;
    const { rentalStartDate, rentalEndDate } = req.body;

    const rental_postoji = rentals.find(rental => rental.id == idRental);
    if(!rental_postoji) {
        res.status(404).json({ greska: `Rental sa id-em ${idRental} ne postoji`})
    }
    if (new Date(rentalEndDate) < new Date(rentalStartDate)) {
        res.status(400).json({ greska: 'Datum kraja najma ne moze biti poslje pocetka najma'});
    }

    const razlika_dani = razlika_datuma(rentalStartDate, rentalEndDate);

    const boat = boats.find(boat => boat.id == rental_postoji.boatId);
    if(!boat) {
        res.status(404).json({ greska: `Brod sa id-em ${rental_postoji.boatId} ne postoji`});
    }
    rental_postoji.rentalStartDate = rentalStartDate;
    rental_postoji.rentalEndDate = rentalEndDate;
    rental_postoji.totalPrice = boat.cijenaPoDanu * razlika_dani;

    res.status(200).json(rental_postoji);
})

export default router;