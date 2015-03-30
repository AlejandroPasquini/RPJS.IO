'use strict'
// this is a base64 file validate system for socket io and the chat system.
var fileValidTypes = /(image|audio)/;
var fileSize = 1398117; //1MB
var maxFileSize = fileSize * 2.5

exports.file =function (validate){
	/*jshint validthis: true */
	if (validate.type.match(fileValidTypes)) {
		if(validate.length <= maxFileSize) {
			this.next='Archivo verificado';	
			}
		else {
			this.err='La imagen supera el tamaño maximo permitido\nAprox 2,5MB'
		}

			}
		else {
			this.err='Solo se permiten imagenes'
		}
		

}

exports.upload=function (upload,validate){
	/*jshint validthis: true */
	if (upload.match(fileValidTypes)){
		if (upload.length <= maxFileSize) {
		if(validate.length===upload.length){
			if (upload.indexOf(validate.dataBase64Key)!== -1){
				return upload;
			}
		}
	}
	}
	else {
		return false;
		}

}

