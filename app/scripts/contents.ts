chrome.runtime.onMessage.addListener(
  function (request: any, sender: chrome.runtime.MessageSender, sendResponse: any) {

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
      let scrollTopValueByDomainList = new Array();

      chrome.storage.local.get((keys) => {


        // 今回の分も合わせてリスト作り直し
        if (typeof keys !== 'undefined' && typeof keys.scrollTopValueByDomainList !== 'undefined') {

          let index: number = 0;
          for (let scrollTopValueByDomain of keys.scrollTopValueByDomainList) {

            // 同じドメイン上書き
            let flg: boolean = false;
            if (scrollTopValueByDomain.domain === document.location.href.split('/')[2]) {
              flg = true;
            }

            if (flg) {
              keys.scrollTopValueByDomainList[index] = scrollTopValueByDomain;
            } else {
              scrollTopValueByDomainList.push(scrollTopValueByDomain);
            }

            index = index + 1;
          }
        }

        scrollTopValueByDomainList.push({
          domain: document.location.href.split('/')[2],
          scrollTopValue: scrollTop
        });

        chrome.storage.local.set({ scrollTopValueByDomainList: scrollTopValueByDomainList }, function () {
          console.log('complete localStorage value set');

          let responseObj = {
            msg: 'response',
            scrollTop: scrollTop
          };

          sendResponse(responseObj);
        });
      });

    } else if (request.flg === 'jump') {

      let shiori = '';

      for (let scrollTopValueByDomain of request.scrollTopValueByDomainList) {
        if (scrollTopValueByDomain.domain === document.location.href.split('/')[2]) {
          shiori = scrollTopValueByDomain.scrollTopValue;
        }
      }

      // 栞位置までscroll(オートスクロールの場合は4000ms)
      let bodyHeight: any = $('body').height();
      if (parseInt(shiori, 10) > bodyHeight) {
        $('html, body').animate({ scrollTop: shiori }, 4000);
      } else {
        $('html, body').animate({ scrollTop: shiori }, 500);
      }

      // create shiori.
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

    } else if (request.flg === 'top') {

      // jump to bodytop
      $('html, body').animate({ scrollTop: 0 }, 500);

    }
  }
);
