$(function(){
    $('#bOk').click(function(){
       
        var azione = 'readdir';
        var path = $('#path').val();
        $.ajax({
            url: '/readdir',
            method: 'POST',
            data :{
                azione : azione,
                path : path
            },
            contentType : 'application/x-www-form-urlencoded',
            success : function(risp, stato, xhr){
                console.log(risp);
            },
            complete : function(xhr, stato){

            },
            error : function(xhr, stato, errore){
                console.warn(errore);
            }
        });
    });//$('#bOk').click(function(){
});