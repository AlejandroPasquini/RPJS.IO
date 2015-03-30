//Globals var
var usersInPublic = {}

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

function getMarginMsgHeader(){
    var a = $('.profile-img:last').outerWidth(true);
    var b = $('.msg-username:last').outerWidth(true);
    return a+b;

}

function readImageForValidate(input) {

    if ( input.files && input.files[0] ) {
        var reader= new FileReader();
        reader.onload = function(e) {
           var tempArray = [];
           tempArray = e.target.result.split(',',2);
           tempArray[2] =e.target.result.length;
           socketChat.emit('file validate', {type:tempArray[0], dataBase64Key:tempArray[1].substr(tempArray[2]-6,tempArray[2]),
                                            length:tempArray[2]});

             console.log(tempArray);
        };       
        reader.readAsDataURL( input.files[0] );
    }
}

function sendImageForUpload(input) {
    if ( input.files && input.files[0] ) {
        var reader= new FileReader();
        reader.onload = function(e) {
        socketChat.emit('file upload', {file: e.target.result});
        };       
        reader.readAsDataURL( input.files[0] );
    }
}

function assignUserColor(){

  var color = [{'backgroundColor':'#FF0000','color':''},
        {'backgroundColor':'#34FF00','color':''},
        {'backgroundColor':'','color':''}];
  var count = _.size(usersInPublic);

    if (count > color.length) {
      var countBGCtemp=0;
      for (var i =0 ; i <  count; i++,countBGCtemp++) {
       
       if (countBGCtemp>=color.length){
        countBGCtemp-=color.length;
       }

        };  
      return {backgroundColor:color[countBGCtemp-1].backgroundColor};

      }

    else {
     return {backgroundColor:color[count-1].backgroundColor};
    }
  }



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
      'background-color': usersInPublic[msg['username']].backgroundColor
    });
 
    if (scollDown===true) {
       $("#messages-box").animate({ scrollTop: $('#messages-box')[0].scrollHeight},50);
    };


  });

socketChat.on('connection successful',function(obj){

for (var i=0;obj.usersOnLine.length>i;i++){

usersInPublic[obj.usersOnLine[i]] = {}
usersInPublic[obj.usersOnLine[i]]=assignUserColor();

} 

});

socketChat.on('login finish', function(obj){



});

socketChat.on('users public connects',function(name){
  if (typeof usersInPublic[name] !== 'undefined') { 
    usersInPublic[name] = {}
    usersInPublic[name] = assignUserColor();
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
