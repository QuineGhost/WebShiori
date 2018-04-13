chrome.runtime.onMessage.addListener(
  function (request: any, sender: chrome.runtime.MessageSender, sendResponse: any) {

    switch (request.flg) {
      case 'regist':
        // regist scroll top value.
        console.log('on message from ' + request.message);
        regist(sendResponse);
        break;
      case 'jump':
        // jump scroll top value.
        console.log('on message from ' + request.message);
        jump(request, sendResponse);
        break;
      case 'top':
        // jump to bodytop
        $('html, body').animate({ scrollTop: 0 }, 500);
        break;
    }
  }
);

/**
 * regist button
 * @param sendResponse
 */
function regist(sendResponse: any) {
  //  要素が重なっているとなぜ複数リクエストされちゃって(?)、
  //  最終的に0で更新されてしまうから0のときは処理終了
  if ($(window).scrollTop() === 0) {
    return;
  }

  let scrollTop = $(window).scrollTop();
  let scrollTopValueByDomainList = new Array();

  Promise.resolve().then(() => {
    // get shiori value
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

      return Promise.resolve(scrollTopValueByDomainList);
    });
  }).then((res) => {

    chrome.storage.local.set({ scrollTopValueByDomainList: res }, function () {
      console.log('complete localStorage value set');

      let responseObj = {
        msg: 'response',
        scrollTop: scrollTop
      };

      sendResponse(responseObj);
    });

  }).catch((err) => {
    console.error(err);
  });
}

/**
 * jump button
 * @param request
 * @param sendResponse
 */
function jump(request: any, sendResponse: any) {
  let shiori = '';

  for (let scrollTopValueByDomain of request.scrollTopValueByDomainList) {
    if (scrollTopValueByDomain.domain === document.location.href.split('/')[2]) {
      shiori = scrollTopValueByDomain.scrollTopValue;
    }
  }

  // 栞位置までscroll(オートスクロールが必要な場合はheightに合わせて可変)
  let bodyHeight: any = $('body').height();
  if (parseInt(shiori, 10) > bodyHeight) {
    $('html, body').animate({ scrollTop: shiori }, bodyHeight * 8);
  } else {
    $('html, body').animate({ scrollTop: shiori }, 500);
  }

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

}
