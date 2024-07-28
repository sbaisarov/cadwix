const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const path = require('path');

app.use(fileUpload());

// app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    // send files from dist
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

app.post('/upload', (req, res) => {
    if (!req.files || !req.files.dxfFile) {
        return res.status(400).send('No files were uploaded.');
    }
    
    // Process the uploaded file
});

app.get('/api/materials', (req, res) => {
    const materials = [
        {
            name: 'Concrete',
            costPerM2: 100
        },
        {
            name: 'Steel',
            costPerM2: 200
        },
        {
            name: 'Wood',
            costPerM2: 300
        }
    ];
    res.json(materials);
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
});