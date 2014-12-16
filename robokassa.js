(function(module)
{
	'use strict';
	var crypto = require('crypto');

	var NS = module.exports = {};
	// var serviceUrl = 'http://test.robokassa.ru/Index.aspx';
  var serviceUrl = 'https://auth.robokassa.ru/Merchant/Index.aspx';

	function signUrl(mrhLogin, outSum, invId, mrhPass, arrUserParams)
	{
		return crypto.createHash('md5').update([mrhLogin, outSum, invId, mrhPass].concat(arrUserParams).join(':')).digest('hex');
	}

	NS.Robokassa = function(merchantLogin, merchantPass1, merchantPass2)
	{
		this.merchantLogin = merchantLogin;
		this.merchantPass1 = merchantPass1;
		this.merchantPass2 = merchantPass2;
	};

	NS.Robokassa.prototype.congigure = function(merchantLogin, merchantPass1, merchantPass2)
	{
		this.merchantLogin = merchantLogin;
		this.merchantPass1 = merchantPass1;
		this.merchantPass2 = merchantPass2;
	};

	NS.Robokassa.prototype.formPayment = function(outSum, invId, invDesc, optionalParams, shpUserParams)
	{
		var arrOptionalParams = ('undefined' === typeof optionalParams) ? [] : Object.keys(optionalParams).map(
		function(key)
		{ 
			return key + '=' + optionalParams[key];
		});

		var arrUserParams = ('undefined' === typeof shpUserParams) ? [] : Object.keys(shpUserParams).sort().map(
		function(key)
		{ 
			return key + '=' + shpUserParams[key];
		});

		var signatureValue1 = signUrl(this.merchantLogin, outSum, invId, this.merchantPass1, arrUserParams);
		var signatureValue2 = signUrl('', outSum, invId, this.merchantPass2, arrUserParams);

		var url = serviceUrl + 
			'?' + ['MerchantLogin=' + this.merchantLogin, 'OutSum=' + outSum, 'InvId=' + invId, 'InvDesc=' + encodeURIComponent(invDesc)].concat(arrOptionalParams, arrUserParams, ['SignatureValue=' + signatureValue1]).join('&');

		return {url: url, sign: signatureValue2};
	};

	NS.Robokassa.prototype.verifyPaymentSign = function(sign, outSum, invId, shpUserParams)
	{

		var arrUserParams = ('undefined' === typeof shpUserParams) ? [] : Object.keys(shpUserParams).sort().map(
		function(key)
		{ 
			return key + '=' + shpUserParams[key];
		});

		return sign === signUrl('', outSum, invId, this.merchantPass2, arrUserParams);
	};
	
	NS.Robokassa.prototype.getVerifyPaymentSign = function(outSum, invId, shpUserParams)
	{
		var arrUserParams = ('undefined' === typeof shpUserParams) ? [] : Object.keys(shpUserParams).sort().map(
		function(key)
		{ 
			return key + '=' + shpUserParams[key];
		});

		return signUrl('', outSum, invId, this.merchantPass2, arrUserParams);
	}

	

})(module);
