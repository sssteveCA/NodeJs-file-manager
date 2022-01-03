
//Call to Node server to use file functions
function fAjax(url, method, dati){
    $.ajax({
        url: url,
        method: method,
        data : dati,
        contentType : 'application/x-www-form-urlencoded',
        success : function(risp, stato, xhr){
            console.log(risp);
            if(url == '/readdir'){
                if(risp['error'] == 0){
                    tab(risp);
                }
                else{
                    alert("Errore durante la lettura della cartella. Codice "+risp['error']);
                }
            }//if(url == '/readdir'){
            else if(url == '/readfile'){

            }
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
        var tr = $(this).closest('tr');
        var path = tr.find('.fullpath').val();
        window.open('/readfile?path='+path, '_blank').focus();
    });
    $('.delete').on('click',function(){
        var tr = $(this).closest('tr');
        var path = tr.find('.fullpath').val();
        console.log(path);
        dati = {};
        dati['path'] = path;
        dati['title'] = 'Elimina file';
        fDialog(dati);
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
                text: "Sì",
                click : function(){
                    $(this).dialog("close");
                }
            },
            {
                text: "No",
                click : function(){
                    $(this).dialog("close");
                }
            }
        ],
        open : function(){
            $(this).html('Vuoi eliminare il file selezionato? ');
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
        th.text('APRI');
    tr.append(th);
        th = $('<th>');
        th.text('ELIMINA');
    tr.append(th);
    table.append(tr);
    files['files'].forEach(file => {
        tr = $('<tr>');
            td = $('<td>');
            td.text(file['name']);
        tr.append(td);
            td = $('<td>');
            td.text(file['type']);
        tr.append(td);
            td = $('<td>');
            if(file['type'] == 'FILE')td.text(file['size'].toFixed(2)+" KB");
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
        fAjax('/readdir','POST',dati);
    });//$('#bOk').click(function(){
});