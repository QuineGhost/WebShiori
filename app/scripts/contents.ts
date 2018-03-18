chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // if (request.flg === 'get') {
    if (request.flg === 'regist') {

      // get scroll top value.
      console.log('on message from ' + request.message);

      /*要素が重なっているとなぜ複数リクエストされちゃって(?)、
      最終的に0で更新されてしまうから、
      0のときはすぐリターンするようにしている
      */
      if ($(window).scrollTop() === 0) {
        return;
      }

      let scrollTop = $(window).scrollTop();
      chrome.storage.local.set({ 'scrollTopValue': scrollTop }, function () {
        console.log('complete localStorage value set');
      });

      let responseObj = {
        msg: 'response',
        scrollTop: scrollTop
      };

      sendResponse(responseObj);

    } else if (request.flg === 'jump') {
      // jump to shiori

      let shiori = request.scrollTopValue;

      // 栞位置までscroll
      $('html, body').animate({ scrollTop: shiori }, 500);

      let activeShioriElement = $('#shiori-border');
      if (typeof activeShioriElement !== 'undefined') {
        activeShioriElement.remove();
      }

      let shioriElement = $('<img>', {
        'id': 'shiori-border',
        'src': chrome.extension.getURL('/images/shiori.png'),
        'height': '50px'
      }).appendTo('body');

      $('#shiori-border').css({
        top: parseInt(shiori),
        position: 'absolute',
        opacity: '0.3'
      });

      // chrome.storage.local.get('shioriFlg', function (result) {
      //   if (Object.keys(result).length !== 0) {
      //     return;
      //   } else {

      //     let activeShioriElement = $('#shiori-border');
      //     if (typeof activeShioriElement !== 'undefined') {
      //       activeShioriElement.remove();
      //     }

      //     let shioriElement = $('<img>', {
      //       'id': 'shiori-border',
      //       'src': chrome.extension.getURL('/images/shiori.png'),
      //       'height': '50px'
      //     }).appendTo('body');

      //     $('#shiori-border').css({
      //       top: parseInt(shiori),
      //       position: 'absolute',
      //       opacity: '0.3'
      //     });

      //     chrome.storage.local.set({ 'shioriFlg': true });
      //   }
      // });

    } else if (request.flg === 'top') {
      // jump to bodytop

      $('html, body').animate({ scrollTop: 0 }, 500);
    }
  }
);
