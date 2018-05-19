import ChromeHelper from './ChromeHelper';
import 'materialize-css';

const chromeHelper = new ChromeHelper();

// get current scroll top value
// $('#get').on('click', () => {
//     chromeHelper.executeTabsQuery({ active: true }, 'get', 'pushed get button', 'lastScrollTopValue');
// });

// set scroll top value to localstorage
$('#regist').on('click', () => {
    chromeHelper.executeTabsQuery({ active: true }, 'regist', 'pushed regist button', 'registScrollTopValue');

    if ($('#baroon').length > 0) {
        return;
    }
    let $baroon = $('<div id="baroon">OK!</div>');
    $baroon.css({
        'z-index': '100',
        'position': 'absolute',
        'margin-top': '120px'
    });

    $baroon.insertAfter($('head'));
    $baroon.hide().fadeIn(1000);


    setTimeout(() => {
        $('#baroon').fadeOut(2500, () => {
            $('#baroon').remove();
        });
    }, 1000);
});

// scroll to current registed scroll top
$('#jump').on('click', () => {
    chromeHelper.executeTabsQuery({ active: true }, 'jump', 'pushed jump button', 'jumpScrollTopValue');
});

// scroll to page top
$('#top').on('click', () => {
    chromeHelper.executeTabsQuery({ active: true }, 'top', 'pushed top button', '');
});
