var helper = new Helper();

// 現在のスクロールトップの値を取得
$('#get').on('click', function() {
  helper.executeTabsQuery({active: true}, 'get', 'pushed get button', 'lastScrollTopValue');
})

// 現在のスクロールトップの値をregistScrollTopValueというキーでローカルストレージにセット
$('#regist').on('click', function() {
  chrome.storage.local.set({registScrollTopValue: $('#shiori-1').text()}, function() {});
})

// 最新のスクロールトップ値へスクロール
$('#jump').on('click', function() {
  chrome.storage.local.remove('shioriFlg', function(){});
  helper.executeTabsQuery({active: true}, 'jump', 'pushed jump button', 'registScrollTopValue');
})

// ページのトップへスクロール
$('#top').on('click', function() {
  helper.executeTabsQuery({active:true}, 'top', 'pushed top button');
});
