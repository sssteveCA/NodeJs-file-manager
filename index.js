const copyD = '/copyDir';
const copyF = '/copyFile';
const delD = '/delDir';
const delF = '/delFile';
const moveD = '/moveDir';
const moveF = '/moveFile';
const readD = '/readDir';
const readF = '/readFile';
const file = require('./file');
const dir = require('./dir');
const path = require('path');
const express = require('express');
const bp = require('body-parser');
var app = express();
var jsonParser = bp.json();
var urlParser = bp.urlencoded({extended: false});
app.use(jsonParser);
app.use(urlParser);



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

app.get("/js/jQuery.js",(req,res) => {
    res.sendFile(path.resolve(__dirname,'node_modules/jquery/dist/jquery.min.js'));
});

app.get("/css/jQueryUI.css",(req,res) => {
    res.sendFile(path.resolve(__dirname,'node_modules/jquery-ui-dist/jquery-ui.min.css'));
});

app.get("/js/jQueryUI.js",(req,res) => {
    res.sendFile(path.resolve(__dirname,'node_modules/jquery-ui-dist/jquery-ui.min.js'));
});

app.get("/js/functions.js",(req,res) => {
    res.sendFile(path.join(__dirname,'/views/js/functions.js'));
});

app.get("/js/home.js",(req,res) => {
    res.sendFile(path.join(__dirname,'/views/js/home.js'));
});

//copy a file
app.post(copyF,(req,res) => {
    console.log(req.body);
    let src = req.body.path;
    let dest = req.body.dest;
    let fd = new file.MyFile(src);
    let copied = fd.copyFile(dest);
    let errno = fd.getError();
    let risp = {};
    risp['error'] = errno;
    switch(errno){
        case 0:
            risp['msg'] = 'Il file è stato copiato in '+dest;
            break;
        case file.MyFile.FILE_NOTEXISTS:
            risp['msg'] = 'Il file sorgente specificato non esiste';
            break;
        case file.MyFile.FILE_NOTAFILE:
            risp['msg'] = 'Il percorso sorgente specificato non appartiene ad un file';
            break;
        case file.MyFile.FILE_DESTEXISTS:
            risp['msg'] = 'Il percorso di destinazione appartiene ad un \' altra risorsa';
            break;
        default:
            risp['msg'] = 'Errore sconosciuto';
            break;
    }//switch(errno){
    res.send(risp);
});

app.post(delD,(req,res) => {

});

//delete a file
app.post(delF,(req,res) => {
    console.log(req.body);
    let pathD = req.body.path;
    let fd = new file.MyFile(pathD);
    let canc = fd.delFile();
    let errno = fd.getError();
    let risp = {};
    risp['error'] = errno;
    if(errno == 0){
        risp['msg'] = "Il file è stato eliminato";
        risp['path'] = path.dirname(pathD);
    }
    else if(errno == file.MyFile.FILE_NOTEXISTS)
        risp['msg'] = "Il file che stai cercando non esiste";
    else if(errno == file.MyFile.FILE_NOTAFILE)
        risp['msg'] = "Il percorso specificato non appartiene ad un file";
    res.send(risp);
});

//move a file
app.post(moveF,(req,res) => {
    console.log(req.body);
    let src = req.body.path;
    let dest = req.body.dest;
    let fd = new file.MyFile(src);
    let moved = fd.moveFile(dest);
    let errno = fd.getError();
    let risp = {};
    risp['error'] = errno;
    switch(errno){
        case 0:
            risp['msg'] = 'Il file è stato spostato in '+dest;
            risp['path'] = path.dirname(src);
            break;
        case file.MyFile.FILE_NOTEXISTS:
            risp['msg'] = 'Il file sorgente specificato non esiste';
            break;
        case file.MyFile.FILE_NOTAFILE:
            risp['msg'] = 'Il percorso sorgente specificato non appartiene ad un file';
            break;
        case file.MyFile.FILE_DESTEXISTS:
            risp['msg'] = 'Il percorso di destinazione appartiene ad un \' altra risorsa';
            break;
        default:
            break;
    }//switch(errno){
    res.send(risp);
});

//read a file
app.get(readF,(req,res) => {
    console.log(req.query.path);
    var path = req.query.path;
    let fd = new file.MyFile(path);
    let content = fd.readFile();
    let errno = fd.getError();
    let risp = "";
    if(errno == 0)
        risp = content;
    else if(errno == file.MyFile.FILE_NOTEXISTS)
        risp = "Il file che stai cercando non esiste";
    else if(errno == file.MyFile.FILE_NOTAFILE)
        risp = "Il percorso specificato non appartiene ad un file";
    res.send(risp);
});

//Read a directory
app.post(readD,(req,res) => {
    //console.log(req.body);
    //res.send(req.body);
    var path = req.body.path;
    let folder = new dir.MyDir(path);
    let names = folder.readDir();
    names['path'] = folder.getPath();
    names['error'] = folder.getError();
    res.json(names);
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server in ascolto all'indirizzo http://localhost:"+port);
});
