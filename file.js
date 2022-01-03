const fs = require('fs');

class MyFile{

    static FILE_NOTEXISTS = 1;
    static FILE_NOTAFILE = 2;

    path;
    error;

    constructor(path){
        this.path = path;
        this.error = 0;
    }

    //delete the file
    delFile(){
        var canc = false;
        if(this.esiste()){
            if(this.isFile()){
                fs.unlinkSync(this.path);
                canc = true;
            }
            else
                this.error = MyFile.FILE_NOTAFILE;

        }//if(this.esiste()){
        else
            this.error = MyFile.FILE_NOTEXISTS;
        return canc;
    }

    //if the specified file exists
    esiste(){
        var esiste = false;
        if(fs.existsSync(this.path)){
            esiste = true;
        }
        return esiste;
    }

    //true if is a file
    isFile(){
        var isFile = false;
        if(fs.statSync(this.path).isFile()){
            isFile = true;
        }
        return isFile;
    }

    getError(){
        return this.error;
    }

    getPath(){
        return this.path;
    }

    //read a file
    readFile(){
        let fileContent = null;
        this.error = 0;
        if(this.esiste()){
            if(this.isFile()){
                fileContent = fs.readFileSync(this.path, 'utf-8');
            }
            else
                this.error = MyFile.FILE_NOTAFILE;

        }//if(this.esiste()){
        else
            this.error = MyFile.FILE_NOTEXISTS;
        return fileContent;
    }

}

module.exports = {MyFile}