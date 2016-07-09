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
    sortByCreated: true
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
        }
    })
}

function modifyAnswerLinks() {
    $('a.question_link:not(.mzh)').each(function() {
        let $link = $(this)
        let linkArr = $link.attr('href').split('#')
        let newLink = linkArr[0] + '?sort=created#' + (linkArr[1] || '')

        $link.attr('href', newLink);
    });
}
