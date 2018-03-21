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

            chrome.tabs.sendMessage(currentTab.id, requestObj, (res: any) => {
              console.log(res);
            });
            break;

          case 'jump':

            chrome.storage.local.get(function (keys) {
              chrome.tabs.sendMessage(
                currentTab.id,
                {
                  scrollTopValueByDomainList: keys.scrollTopValueByDomainList,
                  flg: flg
                },
                function (res: Response) {

                }
              );
            });
            break;
        }

      } catch (e) {
        console.error(e.message);
      }
    });
  }
}

export default ChromeHelper;
