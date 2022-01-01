const file = require('./file');
const path = require('path');
const express = require('express');
var app = express();

function readFile(mf){
    let risp = "";
    let index = mf.readFile();
    if(index != null){
        risp = index;
    }
    else{
        risp = "Errore durante la lettura del file. Codice: "+mf.getErrore();
    }
    return risp;
}

app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname,'/views/home.html'));
});

app.get("/css/main.min.css",(req,res) => {
    res.sendFile(path.join(__dirname,'/views/css/main.min.css'));
});

app.get("/js/home.js",(req,res) => {
    res.sendFile(path.join(__dirname,'/views/js/home.js'));
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server in ascolto sulla porta "+port);
});
