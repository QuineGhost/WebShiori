chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.flg ===  'get') {
        console.log('on message from ' + request.message);

        /*要素が重なっているとなぜ複数リクエストされちゃって(?)、
        最終的に0で更新されてしまうから、
        0のときはすぐリターンするようにしている
        */
        if(document.body.scrollTop === 0) {
          return;
        }

        var scrollTop = document.body.scrollTop;
        chrome.storage.local.set({'scrollTopValue': scrollTop}, function() {
          console.log('storage set');
        });

        var responseObj = {
          msg: 'response',
          scrollTop: scrollTop
        }
        sendResponse(responseObj);
      } else if(request.flg === 'jump') {
        var shiori = request.scrollTopValue;
        $('body').animate({scrollTop: shiori}, 500);
        chrome.storage.local.get('shioriFlg', function(result) {
          if(Object.keys(result).length != 0) {
            return;
          } else {

            var activeShioriElement = $('#shiori-border');
            if(typeof activeShioriElement != 'undefined') {
              activeShioriElement.remove();
            }

            var shioriElement = $('<img>', {
              'id': 'shiori-border',
              'src': chrome.extension.getURL('images/shiori.png'),
              'height': '50px'
            }).appendTo('body');

            $('#shiori-border').css({
              top: parseInt(shiori),
              position: 'absolute',
              opacity: '0.3'
            });

            chrome.storage.local.set({'shioriFlg': true});
          }
        });

      } else if(request.flg === 'top') {
        if($('#shiori-border').size()) $('#shiori-border').remove();
        $('body').animate({scrollTop: 0}, 500);
      }
    }
);
