const fs = require('fs');
const pt = require('path');

class MyDir{
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
        return this.path;
    }

    readDir(){
        let names = {};
        names['files'] = new Array();
        this.error = 0;
        if(this.esiste()){
            if(this.isDir()){
                let objPath = this.path;
                var i = 0;
                fs.readdirSync(this.path).forEach(function(nome){
                    //concat the opened path to filename
                    let fullpath = pt.resolve(objPath,nome);
                    names['files'][i] = {};
                    names['files'][i]['name'] = nome;
                    names['files'][i]['fullpath'] = fullpath;
                    if(fs.statSync(fullpath).isDirectory()){
                        names['files'][i]['type'] = "CARTELLA";
                        names['files'][i]['size'] = "";
                    }
                    else if(fs.statSync(fullpath).isFile()){
                        names['files'][i]['type'] = "FILE";
                        names['files'][i]['size'] = fs.statSync(fullpath).size / 1024;
                    }
                    else names['files'][i]['type'] = "ALTRO";
                    i++;
                });
                //console.log(names);
            }//if(this.isDir()){
            else{
                this.error = MyDir.DIR_NOTADIR;
            }
        }//if(this.esiste()){
        else{
            this.error = MyDir.DIR_NOTEXISTS;
        }
        return names;
    }
}

module.exports = {MyDir}