class ChromeHelper {
  public executeTabsQuery(queryInfo: any, flg: string, message: string, localStorageKeyName: string) {
    if (typeof localStorageKeyName === 'undefined') {
      localStorageKeyName = '';
    }

    // get current open tab info.
    chrome.tabs.query(queryInfo, function (tabs) {

      try {
        let currentTab: any = tabs.shift();
        let requestObj = {
          flg: flg,
          message: message
        };

        let scrollTopValue = '';

        switch (flg) {
          case 'top':
            // topボタン押した場合、contents側には何も送信しない
            chrome.tabs.sendMessage(currentTab.id, requestObj, function (res: any) { });
            break;
          case 'regist':
            // registボタン押した場合、localStorageにscrollTop格納
            // chrome.storage.local.get(function (keys) {
            //   chrome.tabs.sendMessage(
            //     currentTab.id,
            //     { scrollTopValue: keys.registScrollTopValue, flg: flg },
            //     function (res: Response) { }
            //   );
            // });
            chrome.tabs.sendMessage(currentTab.id, requestObj, (res: any) => {
              console.log(res);
            });
            break;

          case 'jump':

            chrome.storage.local.get(function (keys) {
              chrome.tabs.sendMessage(
                currentTab.id,
                { scrollTopValue: keys.scrollTopValue, flg: flg },
                function (res: Response) { }
              );
            });
            // chrome.tabs.sendMessage(currentTab.id, requestObj, function (res: any) {
            //   scrollTopValue = res.scrollTop;
            //   $('#shiori-1').text(scrollTopValue.toString());
            // });
            break;
        }

        // if (localStorageKeyName === 'lastScrollTopValue') {
        //   chrome.tabs.sendMessage(currentTab.id, requestObj, function (res: any) {
        //     scrollTopValue = res.scrollTop;
        //     $('#shiori-1').text(scrollTopValue.toString());
        //   });
        // } else if (localStorageKeyName === 'registScrollTopValue') {

        //   chrome.storage.local.get(function (keys) {
        //     chrome.tabs.sendMessage(
        //       currentTab.id,
        //       { scrollTopValue: keys.registScrollTopValue, flg: flg },
        //       function (res: Response) { }
        //     );
        //   });

        // }

      } catch (e) {
        console.error(e.message);
      }
    });
  }
}

export default ChromeHelper;
