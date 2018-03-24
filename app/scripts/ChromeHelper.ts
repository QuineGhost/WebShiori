class ChromeHelper {
  public executeTabsQuery(queryInfo: any, flg: string, message: string, localStorageKeyName: string) {
    if (typeof localStorageKeyName === 'undefined') {
      localStorageKeyName = '';
    }

    const promise = new Promise((resolve, reject) => {

      chrome.tabs.query(queryInfo, function (tabs) {

        let res = {
          currentTab: tabs.shift(),
          requestObj: {
            flg: flg,
            message: message
          }
        };

        resolve(res);
      });

    }).then((res: any) => {

      let scrollTopValue = '';

      switch (flg) {
        case 'top':

          // topボタン押した場合、contents側には何も送信しない
          chrome.tabs.sendMessage(res.currentTab.id, res.requestObj, function (res: any) { });
          break;
        case 'regist':

          chrome.tabs.sendMessage(res.currentTab.id, res.requestObj, (res: any) => {
            console.log(res);
          });
          break;

        case 'jump':

          chrome.storage.local.get(function (keys) {
            chrome.tabs.sendMessage(
              res.currentTab.id,
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

    }).catch((err) => {
      console.log(err);
    });

  }
}

export default ChromeHelper;
