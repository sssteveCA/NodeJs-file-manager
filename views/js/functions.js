
//add events to the buttons created with the table
function addEvent(){
    $('.open').on('click',function(){
        var path = getInfo($(this));
        if(path['type'] == 'FILE')
            window.open(readF+'?path='+path['path'], '_blank').focus();
        else if(path['type'] == 'CARTELLA'){
            var params = {};
            params['path'] = path['path'];
            fAjax(readD,'POST',params);
        }//else if(path['type'] == 'CARTELLA'){

    });
    $('.delete').on('click',function(){
        var info = getInfo($(this));
        dati = {};
        if(info['type'] == 'FILE'){
            dati['action'] = delF;
            dati['title'] = 'Elimina file';
            dati['html'] = 'Vuoi eliminare il file selezionato?';
        }
        else{
            dati['action'] = delD;
            dati['title'] = 'Elimina cartella';
            dati['html'] = 'Vuoi eliminare la cartella selezionata?';
        }
        dati['bt1'] = 'Sì'; //1st button of dialog
        dati['bt2'] = 'No'; //2nd button of dialog
        dati['path'] = info['path'];  
        fDialog(dati);
    });//$('.delete').on('click',function(){
    $('.copy').on('click',function(){
        var info = getInfo($(this));
        dati = {};
        if(path['type'] == 'FILE'){
            dati['action'] = copyF;
            dati['title'] = 'Copia file';
        }
        else{
            dati['action'] = copyD;
            dati['title'] = 'Copia cartella';
        }
        dati['path'] = info['path']; //source path
        dati['bt1'] = 'Copia'; //1st button of dialog
        dati['bt2'] = 'Annulla'; //2nd button of dialog
        dati['html'] = `
<div>Inserisci il percorso di destinazione</div>
<div><input type="text" id="dest" name="dest"></div>`;
        fDialog(dati);
    });
    $('.move').on('click',function(){
        var path = getInfo($(this));
        var info = getInfo($(this));
        dati = {};
        if(path['type'] == 'FILE'){
            dati['action'] = moveF;
            dati['title'] = 'Sposta file';
        }
        else{
            dati['action'] = moveD;
            dati['title'] = 'Sposta cartella';
        }
        dati['path'] = info['path']; //source path
        dati['bt1'] = 'Sposta'; //1st button of dialog
        dati['bt2'] = 'Annulla'; //2nd button of dialog
        dati['html'] = `
<div>Inserisci il percorso di destinazione</div>
<div><input type="text" id="dest" name="dest"></div>`;
        fDialog(dati);
    });
}

//get path from input hidden in table row
function getInfo(td){
    var info = {};
    var tr = td.closest('tr');
    info['name'] = tr.find('.name').text();
    info['path'] = tr.find('.fullpath').val();
    info['type'] = tr.find('.type').text();
    //console.log(info);
    return info;
}

//create table and display list of files
function tab(files){
    var table,tr,th,td,button,input;
    $('#pathString').html(files['path']);
    $('#tabFiles').html('');
    table = $('<table>');
    var headers = new Array('NOME','TIPO','DIMENSIONE','','','','');
    tr = $('<tr>');
    for(var v of headers){
        th = $('<th>');
        th.attr('scope','col');
        th.text(v);
        tr.append(th);
    }
    table.append(tr);
    var backFolder = new Array("../","CARTELLA","","APRI","","","");
    var classes = new Array("name","type","size","open","delete","copy","move");
    tr = $('<tr>');
        input = $('<input>');
        input.attr({
            type : 'hidden',
            value : files['path']
        });
        input.addClass("fullpath");
    tr.append(input);
    table.append(tr);
    files['files'].forEach(file => {
        tr = $('<tr>');
            td = $('<td>');
            td.text(file['name']);
            td.addClass(classes[0]);
        tr.append(td);
            td = $('<td>');
            td.text(file['type']);
            td.addClass(classes[1]);
        tr.append(td);
            td = $('<td>');
            if(file['type'] == 'FILE'){
                td.text(file['size'].toFixed(2)+" KB");
                td.addClass(classes[2]);
            }
            else td.text('');
        tr.append(td);
            td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass(classes[3]+" btn btn-primary");
                button.text("APRI");
            td.append(button);
        tr.append(td);
            td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass(classes[4]+" btn btn-danger");
                button.text("ELIMINA");
            td.append(button);
        tr.append(td);
        td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass(classes[5]+" btn btn-secondary");
                button.text("COPIA");
            td.append(button);
        tr.append(td);
        td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass(classes[6]+" btn btn-secondary");
                button.text("SPOSTA");
            td.append(button);
        tr.append(td);
            input = $('<input>');
            input.attr({
                type : 'hidden',
                value : file['fullpath']
            });
            input.addClass("fullpath");
        tr.append(input);
        table.append(tr);
    });//files['files'].forEach(file => {
    $('#tabFiles').append(table);
    addEvent();
}