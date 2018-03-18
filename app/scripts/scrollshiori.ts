import ChromeHelper from './ChromeHelper';
import 'materialize-css';

const chromeHelper = new ChromeHelper();

// get current scroll top value
// $('#get').on('click', () => {
//     chromeHelper.executeTabsQuery({ active: true }, 'get', 'pushed get button', 'lastScrollTopValue');
// });

// set scroll top value to localstorage
$('#regist').on('click', () => {
    chrome.storage.local.set({ registScrollTopValue: $('#shiori-1').text() }, () => { });
    chromeHelper.executeTabsQuery({ active: true }, 'regist', 'pushed regist button', 'registScrollTopValue');
});

// scroll to current registed scroll top
$('#jump').on('click', () => {
    chrome.storage.local.remove('shioriFlg', () => { });
    chromeHelper.executeTabsQuery({ active: true }, 'jump', 'pushed jump button', 'jumpScrollTopValue');
});

// scroll to page top
$('#top').on('click', () => {
    chromeHelper.executeTabsQuery({ active: true }, 'top', 'pushed top button', '');
});
