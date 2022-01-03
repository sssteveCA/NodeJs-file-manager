var copyD = '/copyDir';
var copyF = '/copyFile';
var delD = '/delDir';
var delF = '/delFile';
var moveD = '/moveDir';
var moveF = '/moveFile';
var readD = '/readDir';
var readF = '/readFile';


//get path from input hidden in table row
function getInfo(td){
    var info = {};
    var tr = td.closest('tr');
    info['path'] = tr.find('.fullpath').val();
    info['type'] = tr.find('.type').text();
    console.log(info);
    return info;
}


//Call to Node server to use file functions
function fAjax(url, method, dati){
    $.ajax({
        url: url,
        method: method,
        data : dati,
        contentType : 'application/x-www-form-urlencoded',
        success : function(risp, stato, xhr){
            console.log(risp);
            if(url == readD){
                if(risp['error'] == 0){
                    tab(risp);
                }
                else{
                    alert("Errore durante la lettura della cartella. Codice "+risp['error']);
                }
            }//if(url == '/readdir'){
            else if(url == delF){
                alert(risp['msg']);
                if(risp['error'] == 0){
                    var arg = {};
                    arg['path'] = risp['path'];
                    fAjax(readD,'POST',arg);
                }
            }//else if(url == '/delfile'){
        },
        complete : function(xhr, stato){

        },
        error : function(xhr, stato, errore){
            console.warn(errore);
        }
    });
}

//add events to the buttons created with the table
function addEvent(){
    $('.open').on('click',function(){
        var path = getInfo($(this));
        window.open(readF+'?path='+path['path'], '_blank').focus();
    });
    $('.delete').on('click',function(){
        dati = {};
        dati['action'] = delF;
        dati['path'] = getInfo($(this))['path'];
        dati['title'] = 'Elimina file';
        dati['html'] = 'Vuoi eliminare il file selezionato?';
        dati['bt1'] = 'Sì';
        dati['bt2'] = 'No';
        fDialog(dati);
    });//$('.delete').on('click',function(){
    $('.copy').on('click',function(){
        dati = {};
        dati['action'] = copyF;
        dati['path'] = getInfo($(this))['path'];
        dati['title'] = 'Copia file';
        dati['bt1'] = 'Copia';
        dati['bt2'] = 'Annulla';
        dati['html'] = `
<div>Inserisci il percorso di destinazione</div>
<div><input type="text" id="dest" name="dest"></div>`;
        fDialog(dati);
    });
    $('.move').on('click',function(){
        var path = getInfo($(this));
    });
}

//Dialog used in most of file operations
function fDialog(dati){
    $('<dialog id="dialog">').dialog({
        draggable : false,
        resizable : false,
        modal : true,
        title : dati['title'],
        buttons : [
            {
                text: dati['bt1'],
                click : function(){
                    var params = {};
                    params['path'] = dati['path'];
                    fAjax(dati['action'],'POST',params);
                    $(this).dialog("close");
                }
            },
            {
                text: dati['bt2'],
                click : function(){
                    $(this).dialog("close");
                }
            }
        ],
        open : function(){
            $(this).html(dati['html']);
        },
        close : function(){
            $(this).dialog("destroy");
        }
    });
}

function tab(files){
    var table,tr,th,td,button,input;
    $('#pathString').html(files['path']);
    $('#tabFiles').html('');
    table = $('<table>');
    tr = $('<tr>');
        th = $('<th>');
        th.text('NOME');
    tr.append(th);
        th = $('<th>');
        th.text('TIPO');
    tr.append(th);
        th = $('<th>');
        th.text('DIMENSIONE');
    tr.append(th);
        th = $('<th>'); 
    tr.append(th);
        th = $('<th>');
    tr.append(th);
        th = $('<th>');
    tr.append(th);
        th = $('<th>');
    tr.append(th);
    table.append(tr);
    files['files'].forEach(file => {
        tr = $('<tr>');
            td = $('<td>');
            td.text(file['name']);
            td.addClass("name");
        tr.append(td);
            td = $('<td>');
            td.text(file['type']);
            td.addClass("type");
        tr.append(td);
            td = $('<td>');
            if(file['type'] == 'FILE'){
                td.text(file['size'].toFixed(2)+" KB");
                td.addClass("size");
            }
            else td.text('');
        tr.append(td);
            td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass("open");
                button.text("APRI");
            td.append(button);
        tr.append(td);
            td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass("delete");
                button.text("ELIMINA");
            td.append(button);
        tr.append(td);
        td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass("copy");
                button.text("COPIA");
            td.append(button);
        tr.append(td);
        td = $('<td>');
                button = $('<button>');
                button.attr('type','button');
                button.addClass("move");
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

$(function(){
    $('#bOk').click(function(){
        var dati = {};
        dati['azione'] = 'readdir';
        dati['path'] = $('#path').val();
        fAjax(readD,'POST',dati);
    });//$('#bOk').click(function(){
});