
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
    showSliderButton: true,
    autoSlider: false
}

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
            $('#js-home-feed-list,[data-type=daily]').on('DOMSubtreeModified', () => { modifyAnswerLinks() })
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

    if (options.autoSlider) {
        setTimeout(showSlider, 200)
    }
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

let swipe = null

const PAGE_SIZE = 20

function slide() {
    if (!swipe) {
        return;
    }

    if (PAGE_SIZE === swipe.getNumSlides() && swipe.getPos() + 1 === swipe.getNumSlides()) {
        // 最后一个答案以后尝试翻页
        gotoNextPage()
    } else {
        swipe[$(this).data('type')]()
    }
}

function gotoNextPage() {
    let location = window.location
    let search = location.search

    if (search.indexOf('sort=created') === -1) {
        return
    }

    let match = search.match(/page=(\d+)/)
    let page = 1

    if (match) {
        page = Number(match[1]) + 1
    } else {
        page += 1
    }

    location.href = [
        location.protocol,
        '//',
        location.host,
        location.pathname,
        `?sort=created&page=${page}`
    ].join('')
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

    $('.mzh-swipe-wrap').html(sliderTemplate(items))
    $('.mzh-slider-box').show()

    setTimeout(function() {
        swipe = new Swipe(document.getElementById('mzh-slider'), {
          continuous: false,
          callback: function(index, elem) {
              replaceImages(elem)
          },
          transitionEnd: function(index, elem) {}
        });
    }, 100)
}

function replaceImages(elem) {
    let $imgs = $(elem).find('img')

    $imgs.each(function() {
        let $img = $(this)

        let src = $img.attr('src')
        let source = $img.data('actualsrc')

        if (src === source) {
            return
        }

        $img.attr('src', source)
    })
}

function modifyAnswerLinks() {
    $('a.question_link:not(.mzh)').each(function() {
        let $link = $(this)
        let linkArr = $link.attr('href').split('#')
        let newLink = linkArr[0].replace(/\/answer\/(\d+)/, '') + '?sort=created#' + (linkArr[1] || '')

        $link.attr('href', newLink).addClass('mzh')
    });
}
