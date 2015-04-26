//Globals var

var operations = [];

function usersPublicTemplateSystem2() {
  this.mainUserIsSet=false
  this.channel={}
  this.channel.public={}
  this.assignUser= function(id,current){
    if(this.channel.public[id]){return -1};
    var current= ((typeof current === 'undefined' || current===false) || this.mainUserIsSet!==false)? false: true;   
    this.channel.public[id]={};
    if (current===true){this.mainUserIsSet=true}
    var arrayUser= Object.keys(this.channel.public);  
    this.channel.public[id].config={};
    this.channel.public[id].config.style=assignUserStyle(arrayUser,this.mainUserIsSet,current);
  }
}

function getScripts(callback) {
    $.getScript('javascripts/lib.js', function(){
      callback(null, 0);
    });
}
   
function main(callback){

var usersInPublic2 = new usersPublicTemplateSystem2();
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
    $('#messages-box').append('<img download="test" class="img-responsive msg-image center-block" src="'+msg['image']+'">');
  }

  // Formato de divs y clases para el mensaje
    $('#messages-box').append($('<div class="msgTest user-'+msg['username']+'-class">' +
      '<div class="msg-header">'));
    //Insertar usuario y mensaje en su clase correspondiente
    $('.msg-header:last').append($('<img src="http://placehold.it/350x150" class="img-circle profile-img">'),
    $('<div class="msg-username">').text(msg['username'])
    );
    $('.msgTest:last').append($('<div class="msg-text">').text(msg['msg']));
    $('.msg-text:last').css({
      'margin-left': getMarginMsgHeader()+10
    });
    $('.msgTest:last').css({
      'background-color': usersInPublic2.channel.public[msg.id].config.style.backgroundColor
    });
 
    if (scollDown===true) {
       $("#messages-box").animate({ scrollTop: $('#messages-box')[0].scrollHeight},50);
    };

  });


socketChat.emit('request users list');
socketChat.on('response users list',function(array){

for (var i=0;array.usersOnLine.length>i;i++){

usersInPublic2.assignUser(array.usersOnLine[i]); 

} 

});

socketChat.on('login finish', function(obj){
mainUser = obj.id
$( "#username" ).text(obj.username);
$('#login').hide(1500);
usersInPublic2.assignUser(mainUser,true)
Cookies.set('rapidLogin', obj.username);
});

socketChat.on('users public connects',function(id){
    usersInPublic2.assignUser(id); 
  
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




setInterval(function(){

console.log(usersInPublic2.channel.public);

},5000)

callback(null,0);

});
}


operations.push(getScripts);
operations.push(main);


async.series(operations, function (err, responses) {
        
console.log(responses);


});


