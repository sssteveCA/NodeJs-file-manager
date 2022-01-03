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

    //true if the path specified exists
    esiste(){
        let esiste = false;
        if(fs.existsSync(this.path)){
            esiste = true;
        }
        return esiste;
    }

    //true if is a directory
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
        let names = {};
        names['files'] = new Array();
        names['fullpath'] = new Array();
        this.error = 0;
        if(this.esiste()){
            if(this.isDir()){
                let objPath = this.path;
                var i = 0;
                fs.readdirSync(this.path).forEach(function(nome){
                    //concat the opened path to filename
                    let fullpath = pt.resolve(objPath,nome);
                    names['files'][i] = nome;
                    names['fullpath'][i] = fullpath;
                    i++;
                });
                console.log(names);
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