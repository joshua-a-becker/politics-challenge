export default function number_format(number, decimals, max) {  

	var countDecimals = function (value) {    		
		//source: https://stackoverflow.com/questions/17369098/simplest-way-of-getting-the-number-of-decimals-in-a-number-in-javascript
		return value.toString().split(".")[1]===undefined ? 0 : value.toString().split(".")[1].length || 0; 
	}
  
	
	// modified from original to allow variable decimal length inputs, 
	// which requires preserving the decimal in "1." and "1.0"
	// this assumes a STRING input (so that 1.0 != 1)
	
	var decimals_param = decimals;
	
	decimals = decimals || countDecimals(number);
	const addDecimal = number.includes(".") && decimals==0;
	
	
	if(max & decimals_param!=undefined & countDecimals(number)<decimals_param) {
		decimals=countDecimals(number)
	}
	
	// source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	var n = !isFinite(+number) ? 0 : +number, 
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			toFixedFix = function (n, prec) {
					// Fix for IE parseFloat(0.55).toFixed(0) = 0;
					var k = Math.pow(10, prec);
					return Math.round(n * k) / k;
			},
			s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
	if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	var returnString = s.join(dec);
	return addDecimal ? returnString+"." : returnString;
}