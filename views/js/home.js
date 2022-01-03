
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

}

$(function(){
    $('#bOk').click(function(){
        var dati = {};
        dati['azione'] = 'readdir';
        dati['path'] = $('#path').val();
        fAjax('/readdir',dati);
    });//$('#bOk').click(function(){
});