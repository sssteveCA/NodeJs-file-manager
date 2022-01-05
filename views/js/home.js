const copyD = '/copyDir';
const copyF = '/copyFile';
const delD = '/delDir';
const delF = '/delFile';
const moveD = '/moveDir';
const moveF = '/moveFile';
const readD = '/readDir';
const readF = '/readFile';

//Call to Node server to use file functions
function fAjax(url, method, dati){
    console.log("fAjax url => "+url);
    console.log("fAjax dati");
    console.log(dati);
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
            else if(url == delD || url == delF || url == moveF){
                /*If action is delete dir, delete file or move file
                It's necessary to reload the directory*/
                alert(risp['msg']);
                if(risp['error'] == 0){
                    var arg = {};
                    arg['path'] = risp['path'];
                    fAjax(readD,'POST',arg);
                }
            }//else if(url == '/delfile'){
            else if(url == copyD || url == copyF){
                /* If action is copy dir or copy file 
                It's not necessary to reload the directory */
                alert(risp['msg']);
            }
        },
        complete : function(xhr, stato){

        },
        error : function(xhr, stato, errore){
            console.warn(errore);
        }
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
                    if(dati['action'] == copyD ||dati['action'] == copyF || dati['action'] == moveF){
                        //if action is copy directory, copy file or move file, I get the destination path
                        params['dest'] = $('#dest').val();
                    }
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

$(function(){
    $('#bOk').click(function(){
        var dati = {};
        dati['azione'] = 'readdir';
        dati['path'] = $('#path').val();
        fAjax(readD,'POST',dati);
    });//$('#bOk').click(function(){
});