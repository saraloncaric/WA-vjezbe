import express from 'express';
import cors from 'cors';
import pizza from './routes/pizza.js';
import narudzba from './routes/narudzba.js';

const corsOptions = {
    origin: ['http://localhost:5173', 'http://example.com', 'http://mydomain.com']
};

const app = express();
const PORT = 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use('/pizze', pizza);
app.use('/narudzbe', narudzba);
app.use(cors());

app.get('/', (req, res) => {
    res.send('Dobrodosli u Pizza Express poslužitelj');
})
app.listen(PORT, () => {
    console.log(`Pizza posluzitelj sluša na portu ${PORT}`);
})