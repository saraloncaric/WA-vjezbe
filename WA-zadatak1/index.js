const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html')
})

app.get('/users', (req, res) => {
    const users = [
        { 
            id: 1, 
            ime: 'Sara', 
            prezime: 'Lončarić'
        },
        { 
            id: 2, 
            ime: 'Ana', 
            prezime: 'Anić' 
        },
        { 
            id: 3, 
            ime: 'Marija', 
            prezime: 'Marić' 
        },
    ];
    res.json(users);
})

app.listen(PORT, () => {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
    
});