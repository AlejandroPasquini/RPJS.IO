'use strict';
// include in main.JS
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

function assignUserColor(opt){
  if(typeof opt === 'undefined'){var opt={}}
  if (opt.mainUser){
    return {'backgroundColor':'','color':''}
  }
  else {
  var color = [{'backgroundColor':'#FF0000','color':''},
        {'backgroundColor':'#34FF00','color':''},
        {'backgroundColor':'#666666','color':''}];
  var count = _.size(usersInPublic.list);
  if (usersInPublic.mainUserIsSet===0){count-=1}
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
}

