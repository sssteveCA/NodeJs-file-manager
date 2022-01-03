const fs = require('fs');
const pt = require('path');

class Dir{
    path;
    error;

    static DIR_NOTEXISTS = 1;
    static DIR_NOTADIR = 2;

    constructor(path){
        this.path = path;
        this.error = 0;
    }

    //true se il percorso specificato esiste
    esiste(){
        let esiste = false;
        if(fs.existsSync(this.path)){
            esiste = true;
        }
        return esiste;
    }

    //true se è una cartella
    isDir(){
        let dir = false;
        if(fs.statSync(this.path).isDirectory()){
            dir = true;
        }
        return dir;
    }

    getError(){
        return this.error;
    }

    getPath(){
        return this.percorso;
    }

    readDir(){
        var names = false;
        this.error = 0;
        if(this.esiste()){
            if(this.isDir()){
                names = fs.readdirSync(this.path);
            }//if(this.isDir()){
            else{
                this.error = DIR_NOTADIR;
            }
        }//if(this.esiste()){
        else{
            this.error = DIR_NOTEXISTS;
        }
        return names;
    }
}

module.exports = {Dir}