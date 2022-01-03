
//Call to Node server to use file functions
function fAjax(url, dati){
    $.ajax({
        url: url,
        method: 'POST',
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
            }
        },
        complete : function(xhr, stato){

        },
        error : function(xhr, stato, errore){
            console.warn(errore);
        }
    });
}

function tab(files){
    var table,tr,th,td,button;
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
        table.append(tr);
    });
    $('#tabFiles').append(table);
}

$(function(){
    $('#bOk').click(function(){
        var dati = {};
        dati['azione'] = 'readdir';
        dati['path'] = $('#path').val();
        fAjax('/readdir',dati);
    });//$('#bOk').click(function(){
});