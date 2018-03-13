var Helper = function () { };

//現在アクティブになっているタブの情報を取得する。
Helper.prototype.executeTabsQuery = function (queryInfo, flg, message, localStorageKeyName) {
  if (typeof localStorageKeyName === 'undefined') {
    localStorageKeyName = '';
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    try {
      var currentTab = tabs.shift();
      var requestObj = {
        flg: flg,
        message: message
      };
      var scrollTopValue = '';

      if (flg === 'top') {
        chrome.tabs.sendMessage(currentTab.id, requestObj, function (res) { })
      }

      if (localStorageKeyName === 'lastScrollTopValue') {
        chrome.tabs.sendMessage(currentTab.id, requestObj, function (res) {
          scrollTopValue = res.scrollTop;
          $('#shiori-1').text(scrollTopValue.toString());
        });
      } else if (localStorageKeyName === 'registScrollTopValue') {
        chrome.storage.local.get(function (keys) {
          chrome.tabs.sendMessage(
            currentTab.id,
            { scrollTopValue: keys.registScrollTopValue, flg: flg },
            function (res) { }
          );
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  })
}
