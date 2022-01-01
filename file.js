const fs = require('fs');

class MyFile{

    static FILE_NOTEXISTS = 1;
    static FILE_READERROR = 2;

    percorso;
    errore;

    constructor(path){
        this.percorso = path;
        this.errore = 0;
    }

    //se il file specificato esiste
    esiste(){
        var esiste = false;
        if(fs.existsSync(this.percorso)){
            esiste = true;
        }
        return esiste;
    }

    getErrore(){
        return this.errore;
    }

    //lettura di un file
    readFile(){
        let fileContent = null;
        this.errore = 0;
        if(this.esiste()){
            fileContent = fs.readFileSync(this.percorso, 'utf-8');

        }//if(this.esiste()){
        else{
            this.errore = MyFile.FILE_NOTEXISTS;
        }
        return fileContent;
    }

}

module.exports = {MyFile}