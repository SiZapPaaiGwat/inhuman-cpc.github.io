(function ($) {
  // Caption
  $('.article-entry').each(function (i) {
    $(this).find('img').each(function () {
      if ($(this).parent().hasClass('fancybox')) return

      var alt = this.alt

      if (alt) {
        $(this).after('<span class="caption">' + alt + '</span>')
      }

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>')
    })

    $(this).find('.fancybox').each(function () {
      $(this).attr('rel', 'article' + i)
    })
  })

  if ($.fancybox) {
    $('.fancybox').fancybox()
  }


  $(document).ready(function() {
	  var QRBox	=	$('#QRBox');
	  var MainBox	=	$('.MainBox');
	  var BTCQR	=	$('#BTCQR');
	  var AliPayQR	=	$('#AliPayQR');
	  var WeChatQR	=	$('#WeChatQR');
    var currentQR;

	  function showQR(QR) {
		  $('#DonateText,#donateBox,#github').addClass('blur');
      currentQR = QR;
		  QRBox.fadeIn(300,function(argument) {
			  QR.addClass('showQR');
		  });
	  }

	  $('#donateBox>li').click(function(event) {
		  var thisID	=	$(this).attr('id');
		  if (thisID === 'BTC') {
			  showQR(BTCQR);
			  new Clipboard('#BTCBn');
		  } else if (thisID === 'AliPay') {
			  showQR(AliPayQR);
		  } else if (thisID === 'WeChat') {
			  showQR(WeChatQR);
		  }
	  });

	  MainBox.click(function(event) {
		  if (currentQR) currentQR.removeClass('showQR').addClass('hideQR');
		  setTimeout (function(a) {
			  QRBox.fadeOut(300,function(argument) {
				  MainBox.removeClass('hideQR');
			  });
			  $('#DonateText,#donateBox,#github').removeClass('blur');
		  },600);

	  });
  });
})(jQuery)
