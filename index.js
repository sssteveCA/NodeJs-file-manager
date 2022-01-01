const http = require('http');
const file = require('./file');

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
