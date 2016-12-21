function appendStyleNode(id, href) {
    var cssNode = document.createElement('link')
    cssNode.type = 'text/css'
    cssNode.rel = 'stylesheet'
    cssNode.id = id
    cssNode.href = href
    document.documentElement.appendChild(cssNode)
}

var href = chrome.extension.getURL('css/main.css')

appendStyleNode('mzh', href)

var options = {
    maxHeight: 250,
    hidename: true,
    hideupdown: true,
    hideSidebar: true,
    hideComments: true,
    sortByCreated: true,
    showSliderButton: true
};

chrome.storage.local.get('options', (data) => {
    options = Object.assign(options, data.options)
    initMyZhihu()
})

function initMyZhihu() {
    let classList = ['hidename', 'hideupdown', 'hideSidebar', 'hideComments'].map((item) => {
        if (options[item]) {
            return 'mzh-' + item
        }
    })

    if (classList.length) {
        document.documentElement.className += ' ' + classList.join(' ')
    }

    $(() => {
        if (options.sortByCreated) {
            modifyAnswerLinks()
            $('#js-home-feed-list').on('DOMSubtreeModified', () => { modifyAnswerLinks() })
        }

        if (options.showSliderButton && window.location.href.indexOf('/question') !== -1) {
            insertSlider()
        }
    })
}

function insertSlider() {
    let $btn = $(`
            <div id="mzh-slider-btn" class="mzh-slider-btn">slider</div>
        `)

    let $swipe = $(`
        <div class="mzh-slider-box">
            <div id='mzh-slider' class='mzh-swipe'>
                <div class='mzh-swipe-wrap'>
                </div>
            </div>
            <div class="mzh-slider-close-btn">x</div>
            <div class="mzh-slider-nav-prev mzh-slider-nav" data-type="prev"><span>上一个</span></div>
            <div class="mzh-slider-nav-next mzh-slider-nav" data-type="next"><span>下一个</span></div>
        </div>
        `)

    $btn.on('click', showSlider)
    $swipe.find('.mzh-slider-nav').on('click', slide)
    $swipe.find('.mzh-slider-close-btn').on('click', removeSlider)

    $('body').append($btn).append($swipe)
}

let sliderTemplate = function(items) {
    return items.map((item) => {
        return `
            <div class="mzh-answer-box">
                <div class="mzh-answer-content">${item}</div>
            </div>
        `
    })
};

let swipe = null;

function slide() {
    if (!swipe) {
        return;
    }

    swipe[$(this).data('type')]();
}

function removeSlider() {
    swipe = null;
    $('#mzh-slider .mzh-swipe-wrap').empty()
    $('.mzh-slider-box').hide()
}

function showSlider() {
    let items = [];

    $('#zh-question-answer-wrap .zm-editable-content').each(function() {
        items.push($(this).html())
    })

    console.log(items)

    $('.mzh-swipe-wrap').html(sliderTemplate(items))
    $('.mzh-slider-box').show()

    setTimeout(function() {
        swipe = new Swipe(document.getElementById('mzh-slider'), {
          continuous: false,
          callback: function(index, elem) {},
          transitionEnd: function(index, elem) {}
        });
    }, 100)
}

function modifyAnswerLinks() {
    $('a.question_link:not(.mzh)').each(function() {
        let $link = $(this)
        let linkArr = $link.attr('href').split('#')
        let newLink = linkArr[0] + '?sort=created#' + (linkArr[1] || '')

        $link.attr('href', newLink).addClass('mzh')
    });
}
