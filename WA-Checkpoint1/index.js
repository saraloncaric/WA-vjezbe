import express from 'express';
import agencijaRoutes from './routes/agencijaRoutes.js';
import putovanjaRoutes from './routes/putovanjaRoutes.js';
import korisniciRoutes from './routes/korisniciRoutes.js';

const app = express();
const PORT = 3000;
app.use(express.json());

app.use('/api/putovanja', putovanjaRoutes);
app.use('/api/agencije', agencijaRoutes);
app.use('/api/korisnici', korisniciRoutes);

app.listen(PORT, (error) => {
    if (error) {
        console.log(`Greška pri pokretanju: ${error.message}`)
    } else {
        console.log(`Posluzitelj radi na portu ${PORT}`);
    }
})
