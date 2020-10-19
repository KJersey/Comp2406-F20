const express = require('express');
const app = express();
const path = require('path');
const port = 8000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/movie.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/movie.html'));
});

app.get('/person.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/person.html'));
});

app.get('/signin.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/signin.html'));
});

app.get('/userprofile.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/userprofile.html'));
});

app.listen(port, () => {});