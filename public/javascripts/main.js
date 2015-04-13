//Globals var
function usersPublicTemplateSystem() {
  this.mainUserIsSet=1
  this.list={}
  this.assignName= function(name,current){   
    this.list[name]={};
    if (current===0){this.mainUserIsSet=0}
    this.list[name].config={};
    this.list[name].config.style={}; 
  }
}
$.getScript('javascripts/lib.js')

var usersInPublic = new usersPublicTemplateSystem()

var mainUser ='';
$(document).ready(function() {


$('#messages-box').css({
  height: $(window).height()-105
});


$(window).on('resize', function(){
$('#messages-box').css({
  height: $(window).height()-105
});


});

//

$('#button-image').click(function() {
$( "#inputImage" ).click()

});

$("#inputImage").change(function(){
    readImageForValidate( this );

  $('#button-image').removeClass('btn-primary').addClass('btn-warning').children().removeClass().addClass(' glyphicon glyphicon-refresh glyphicon-refresh-animate');

});
//

 $('#login').submit(function(event){
    socketChat.emit('login', $('#name').val());
    $( "#username" ).text($('#name').val())
    $('#login').hide(1000)
    event.preventDefault();

  });


    $('#messagesSubmit').submit(function(event){


    socketChat.emit('chat message',  {body:$('#m').val()} );
    $('#m').val('');
    $("#inputImage").val('');
     $('#button-image').removeClass('btn-success').addClass('btn-primary').children().removeClass().addClass('glyphicon glyphicon glyphicon-circle-arrow-up'); 
    event.preventDefault();

  });
   
   socketChat.on('chat message', function(msg){
         var scollDown;
         if ($('#messages-box')[0].scrollHeight - $('#messages-box').scrollTop() <= $('#messages-box').height()+80  ) {      
           scollDown=true;
        }
        else {
            scollDown=false;
        }

     if( typeof msg['image'] !== 'undefined' ) {
    $('#messages-box').append('<img class="img-responsive msg-image center-block" src="'+msg['image']+'">');
  }

  // Formato de divs y clases para el mensaje
    $('#messages-box').append($('<div class="msgTest user-'+msg['username']+'-class">' +
      '<div class="msg-header">'));
    //Insertar usuario y mensaje en su clase correspondiente
    $('.msg-header:last').append($('<img src="http://placehold.it/350x150" class="img-circle profile-img">'),
    $('<div class="msg-username">').text(msg['username'])
    );
    $('.msgTest:last').append($('<div class="msg-text">').text(msg['msg']))
    $('.msg-text:last').css({
      'margin-left': getMarginMsgHeader()+10
    });
    $('.msgTest:last').css({
      'background-color': usersInPublic.list[msg['username']].config.style.backgroundColor
    });
 
    if (scollDown===true) {
       $("#messages-box").animate({ scrollTop: $('#messages-box')[0].scrollHeight},50);
    };

  });

socketChat.on('connection successful',function(obj){

for (var i=0;obj.usersOnLine.length>i;i++){

usersInPublic.assignName(obj.usersOnLine[i]);
usersInPublic.list[obj.usersOnLine[i]].config.style=assignUserColor();

} 

});

socketChat.on('login finish', function(obj){

mainUser = obj.username
usersInPublic.assignName(mainUser,0);
usersInPublic.list[mainUser].config.style =assignUserColor({mainUser:mainUser});

});

socketChat.on('users public connects',function(name){
    if (typeof usersInPublic.list[name]==='undefined'){
    usersInPublic.assignName(name);
    usersInPublic.list[name].config.style = assignUserColor(); 
  }
});

socketChat.on('file validate',function(validate){

if (validate.next){  
sendImageForUpload($("#inputImage")[0]);
}

else if(validate.uploadComplete) {

  $('#button-image').removeClass('btn-warning').addClass('btn-success').children().removeClass().addClass('glyphicon glyphicon-ok');


}
else {
 $('#button-image').removeClass('btn-warning').addClass('btn-primary').children().removeClass().addClass('glyphicon glyphicon glyphicon-circle-arrow-up');  
alert(validate.err);
}

});

});   
