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

    //delete directory and its content
    delDir(){
        let del = false;
        this.errno = 0;
        let files = this.readDir();
        if(this.errno == 0){
            for(var n in files['files']){
                var name = files['files'][n]['name'];
                var fullpath = files['files'][n]['fullpath'];
                if(name != '../'){
                    if(fs.statSync(fullpath).isDirectory()){
                        console.log("ENTRO NELLA CARTELLA "+fullpath);
                        let child_dir = new MyDir(fullpath);
                        let child_del = child_dir.delDir();
                        let child_error = child_dir.getError();
                        if(child_error != 0){
                            this.error = child_error;
                            console.log("Errore cancellazione cartella "+child_dir.getPath()+" codice "+child_error);
                        }
                    }
                    else{
                        console.log("CANCELLO LA RISORSA "+fullpath);
                        fs.unlinkSync(fullpath);
                    }
                }
            }//for(var n in files['files']){
            console.log("CANCELLO LA CARTELLA "+this.path);
            fs.rmdirSync(this.path);
            del = true;
        }//if(this.errno == 0){
        return del;
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
                let parse = pt.parse(objPath);
                var i = 0;
                if(parse.root != objPath){
                    names['files'][i] = {};
                    names['files'][i]['name'] = "../";
                    names['files'][i]['fullpath'] = pt.dirname(objPath);
                    names['files'][i]['type'] = "CARTELLA";
                    names['files'][i]['size'] = "";
                }
                i++;
                fs.readdirSync(this.path).forEach(function(nome){
                    //concat the opened path to filename
                    let fullpath = pt.join(objPath,nome);
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