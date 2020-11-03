$( document ).ready(function() {
    console.log( "ready!" );

function redondear(num){
	return Math.round(num * 100) / 100;
}

function limpiar(num){
	num = num.replace(/[,.]/g, function (m) {
	       // m is the match found in the string
	       // If `,` is matched return `.`, if `.` matched return `,`
	       return m === ',' ? '.' : '';
	});
	return num;
}

function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var comision_ptr=0.00040000;
var comision_pacto=0.05;

// CONSULTA PETRO OFICIAL
// https://petroapp-price.petro.gob.ve/price
$.ajax({
	url: 'https://petroapp-price.petro.gob.ve/price',
	data : { coins : ["PTR"], fiats: ["BS"] },
	type : 'POST',
	dataType : 'json',
	success: function(respuesta) {
		//console.log(respuesta);
		$('#ptr').html(number_format(respuesta.data.PTR.BS,2,',','.'));
		$('#comision_cancelar_bs').html(number_format(redondear(respuesta.data.PTR.BS*comision_ptr),2,',','.'));
		$('#comision_cancelar_ptr').html(comision_ptr);
	},
	error: function() {
        console.log("No se ha podido obtener la información");
    }
});

$('#tasa_c').mask('000.000.000.000.000,00', {reverse: true});
$('#tasa_v').mask('000.000.000.000.000,00', {reverse: true});

$("#cantidad_c").keyup(function() {
	if($("#tasa_c").val()!="" && $(this).val()!="" && $(this).val()!=0 && $("#tasa_c").val()!=0){
// CALCULO DE PTR A OBTENER
	$('#cantidad_bs_c').val(number_format(redondear($("#cantidad_c").val()*limpiar($("#tasa_c").val())),2,',','.'));
	$('#comision_c').val($("#cantidad_c").val()*comision_pacto);
	$('#cantidad_ptr_c').val($("#cantidad_c").val()-$('#comision_c').val());
// CALCULO DE PTR A OBTENER

// CALCULO PARA LA VENTA
	$('#cantidad_v').val($('#cantidad_ptr_c').val());
	let sin_ganancia=true;
	let tasa_temp=parseFloat(limpiar($("#tasa_c").val()));
	let bs_venta_temp=0;
	let comision_venta=0;
	let ganancia=0;
	$("#cantidad_bs_v").val(0);

	while(sin_ganancia){
		tasa_temp=tasa_temp+100;
		bs_venta_temp=$('#cantidad_v').val()*tasa_temp;
		comision_venta=bs_venta_temp*comision_pacto;
		ganancia=bs_venta_temp-comision_venta;
		if(ganancia>limpiar($('#cantidad_bs_c').val())){
			$('#tasa_v').val(number_format(tasa_temp,2,',','.'));
			$('#cantidad_bs_v').val(redondear(bs_venta_temp));
			$('#comision_v').val(redondear(comision_venta));
			$('#cantidad_bs_final_v').val(redondear(ganancia));
			if(ganancia-limpiar($('#cantidad_bs_c').val())>0){
				$("#ganancia").css("color", "green");
			}else{
				$("#ganancia").css("color", "red");
			}
			$('#ganancia').html(number_format(redondear(ganancia-limpiar($('#cantidad_bs_c').val())),2,',','.')  );
			sin_ganancia=false;
		}
	}

// CALCULO PARA LA VENTA
	}else{
		
	}
});





$("#tasa_c").keyup(function() {
	if($("#cantidad_c").val()!="" && $(this).val()!="" && $(this).val()!=0 && $("#cantidad_c").val()!=0){
// CALCULO DE PTR A OBTENER
	$('#cantidad_bs_c').val(number_format($("#cantidad_c").val()*limpiar($("#tasa_c").val()),2,',','.'));
	$('#comision_c').val($("#cantidad_c").val()*comision_pacto);
	$('#cantidad_ptr_c').val($("#cantidad_c").val()-$('#comision_c').val());
// CALCULO DE PTR A OBTENER

// CALCULO PARA LA VENTA
	$('#cantidad_v').val($('#cantidad_ptr_c').val());
	let sin_ganancia=true;
	let tasa_temp=parseFloat(limpiar($("#tasa_c").val()));
	let bs_venta_temp=0;
	let comision_venta=0;
	let ganancia=0;
	$("#cantidad_bs_v").val(0);

	while(sin_ganancia){
		tasa_temp=tasa_temp+100;
		bs_venta_temp=$('#cantidad_v').val()*tasa_temp;
		comision_venta=bs_venta_temp*comision_pacto;
		ganancia=bs_venta_temp-comision_venta;
		if(ganancia>limpiar($('#cantidad_bs_c').val())){
			$('#tasa_v').val(number_format(tasa_temp,2,',','.'));
			$('#cantidad_bs_v').val(number_format(redondear(bs_venta_temp),2,',','.'));
			$('#comision_v').val(number_format(redondear(comision_venta),2,',','.'));
			$('#cantidad_bs_final_v').val(number_format(redondear(ganancia),2,',','.'));
			if(ganancia-limpiar($('#cantidad_bs_c').val())>0){
				$("#ganancia").css("color", "green");
			}else{
				$("#ganancia").css("color", "red");
			}
			$('#ganancia').html( number_format(redondear(ganancia-limpiar($('#cantidad_bs_c').val())),2,',','.')  );
			sin_ganancia=false;
		}
	}

// CALCULO PARA LA VENTA
	}else{
		
	}
});


$("#cantidad_v").keyup(function() {
	if($("#tasa_v").val()!="" && $("#tasa_v").val()!=0){
		$('#cantidad_bs_v').val(number_format( redondear($('#cantidad_v').val()*limpiar($("#tasa_v").val())),2,',','.') );
		$('#comision_v').val(number_format( redondear(limpiar($('#cantidad_bs_v').val())*comision_pacto),2,',','.'));
		$('#cantidad_bs_final_v').val(number_format( redondear(limpiar($('#cantidad_bs_v').val())-limpiar($('#comision_v').val())),2,',','.'));
		if(limpiar($('#cantidad_bs_final_v').val())-limpiar($('#cantidad_bs_c').val())>0){
			$("#ganancia").css("color", "green");
		}else{
			$("#ganancia").css("color", "red");
		}
		$('#ganancia').html( number_format(redondear(limpiar($('#cantidad_bs_final_v').val())-limpiar($('#cantidad_bs_c').val())),2,',','.')   );
	}
});


$("#tasa_v").keyup(function() {
	if($("#cantidad_v").val()!="" && $("#cantidad_v").val()!=0){
		$('#cantidad_bs_v').val(number_format(redondear($('#cantidad_v').val()*limpiar($("#tasa_v").val())),2,',','.'));
		$('#comision_v').val(number_format(redondear(limpiar($('#cantidad_bs_v').val())*comision_pacto),2,',','.'));
		$('#cantidad_bs_final_v').val(number_format(redondear(limpiar($('#cantidad_bs_v').val())-limpiar($('#comision_v').val())),2,',','.'));
		if(limpiar($('#cantidad_bs_final_v').val())-limpiar($('#cantidad_bs_c').val())>0){
			$("#ganancia").css("color", "green");
		}else{
			$("#ganancia").css("color", "red");
		}
		$('#ganancia').html(number_format(redondear(limpiar($('#cantidad_bs_final_v').val())-limpiar($('#cantidad_bs_c').val())),2,',','.'));
	}
});

});
