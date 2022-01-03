const fs = require('fs');

class Dir{
    path;
    error;

    constructor(path){
        this.path = path;
        this.error = 0;
    }

    getError(){
        return this.error;
    }

    getPath(){
        return this.percorso;
    }
}

module.exports = {Dir}