const fs = require('fs');

class MyFile{

    static FILE_NOTEXISTS = 1;
    static FILE_READERROR = 2;

    path;
    error;

    constructor(path){
        this.path = path;
        this.error = 0;
    }

    //se il file specificato esiste
    esiste(){
        var esiste = false;
        if(fs.existsSync(this.path)){
            esiste = true;
        }
        return esiste;
    }

    getError(){
        return this.error;
    }

    getPath(){
        return this.percorso;
    }

    //lettura di un file
    readFile(){
        let fileContent = null;
        this.error = 0;
        if(this.esiste()){
            fileContent = fs.readFileSync(this.percorso, 'utf-8');

        }//if(this.esiste()){
        else{
            this.error = MyFile.FILE_NOTEXISTS;
        }
        return fileContent;
    }

}

module.exports = {MyFile}