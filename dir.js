const fs = require('fs');
const pt = require('path');
const { MyFile } = require('./file');
let file_errno;

class MyDir{
    path;
    error;

    static DIR_NOTEXISTS = 1;
    static DIR_NOTADIR = 2;
    static DIR_COPYERROR = 3;
    static DIR_DELERROR = 4;
    static DIR_DESTEXISTS = 100;

    constructor(path){
        this.path = path;
        this.error = 0;
    }

    //copy directory and its content to dest path
    copyDir(dest){
        let copy = false;
        this.error = 0;
        let newDest = ""; //new file or dir path destination
        let destDir = new MyDir(dest);
        if(!destDir.esiste()){
            destDir.makeDir(); //create the directory if not exists
            let files = this.readDir();
            if(this.error == 0){
                for(var n in files['files']){
                    var name = files['files'][n]['name'];
                    var fullpath = files['files'][n]['fullpath'];
                    var type = files['files'][n]['type'];
                    if(name != '../'){
                        if(type == 'CARTELLA'){
                            let child_dir = new MyDir(fullpath);
                            newDest = dest+pt.sep+name;
                            console.log("ENTRO NELLA CARTELLA "+fullpath);
                            console.log("CARTELLA DESTINAZIONE "+newDest);
                            child_dir.copyDir(newDest);
                        }
                        else{
                            newDest = dest+pt.sep+name;
                            console.log("COPIO LA RISORSA "+fullpath+" IN "+newDest);
                            let fileSrc = new MyFile(fullpath);
                            fileSrc.copyFile(newDest);
                            file_errno = fileSrc.getError();
                            if(file_errno != 0){
                                console.log("Errore copia risorsa "+fileDel.getPath()+" codice "+file_errno);
                            } 
                        }
                    }//if(name != '../'){
                }//for(var i in files['files']){
                copy = true;
            }//if(this.error == 0)
        }//if(!destDir.esiste()){
        else{
            this.error = MyDir.DIR_DESTEXISTS;
        }
        console.log("MyDir copy error "+this.error);
        return copy;
    }

    //delete directory and its content
    delDir(){
        let del = false;
        this.error = 0;
        let files = this.readDir();
        if(this.error == 0){
            for(var n in files['files']){
                var name = files['files'][n]['name'];
                var fullpath = files['files'][n]['fullpath'];
                var type = files['files'][n]['type'];
                //if is not reference to parent directory
                if(name != '../'){
                    if(type == 'CARTELLA'){
                        console.log("ENTRO NELLA CARTELLA "+fullpath);
                        let child_dir = new MyDir(fullpath);
                        let child_del = child_dir.delDir();
                        let child_error = child_dir.getError();
                        if(child_error != 0){
                            console.log("Errore cancellazione cartella "+child_dir.getPath()+" codice "+child_error);
                        }
                    }
                    else{
                        console.log("CANCELLO LA RISORSA "+fullpath);
                        let fileDel = new MyFile(fullpath);
                        fileDel.delFile();
                        file_errno = fileDel.getError();
                        if(file_errno != 0){
                            console.log("Errore cancellazione risorsa "+fileDel.getPath()+" codice "+file_errno);
                        }
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

    //create the directory if not exists
    makeDir(){
        if(!this.esiste()){
            fs.mkdirSync(this.path);
        }
    }

    //move the directory to dest folder
    moveDir(dest){
        let move = false;
        this.error = 0;
        let copied = this.copyDir(dest);
        if(copied){
            let deleted = this.delDir();
            if(deleted)
                move = true;
            else
                this.error = MyDir.DIR_DELERROR;
        }
        else
            this.error = MyDir.DIR_COPYERROR;
        return move;
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