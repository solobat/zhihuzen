$(function() {
    'use strict'
    const CONF = {
        FOLD: '收起',
        UNFOLD: '展开',
        NOIMG: '无图',
        HASIMG: '有图',
        SHOWIMG: '显示图片',
        HIDEIMG: '隐藏图片'
    };

    var options = {
        maxHeight: 250,
        hidename: false,
        hideupdown: false,
        hideSidebar: true,
        fixbar: false
    };

    // toolbar height
    var toolbarH = $('.zu-top').height();

    function bindEvents() {
        $('#zh-question-answer-wrap, #zh-question-collapsed-wrap').on('DOMSubtreeModified', function () {
            hideUserInfo();
            modifyAnswerLinks()
        });

        $(document).on('click', '.zh-summary', function() {
            $(this).closest('.feed-main').find('.zm-votebar').hide();
        });

        $('#js-home-feed-list').on('DOMSubtreeModified', function () {
            hideOnIndex();
            modifyAnswerLinks()
        });
    }

    function hideOnQuestionPage() {
        var $answer = $('.zm-item-answer:not(.mzh)');

        $answer.addClass('mzh');
        $answer.css({
            'padding': '20px 5px'
        });

        if (options.hidename) {
            $answer.find('.answer-head').hide();
            $answer.addClass('mzh-hide');
        }

        if (options.hideupdown) {
            $answer.find('.zm-votebar').find('.up,.down').css('visibility', 'hidden');
        }

        if (options.fixbar) {
            $answer.addClass('mzh-fixbar');
            $answer.find('.zm-meta-panel').find('.meta-item').each(function() {
                var $item = $(this);
                var itemName = $item.attr('name');
                if ($item.hasClass('answer-date-link')) {
                    console.log($item.text().slice(3));
                    $item.text($item.text().slice(3));
                    return;
                }

                if (itemName !== 'favo') {
                    $item.remove();

                    return;
                }

                $item.removeClass('zu-autohide');
            });
        }
    }

    function hideOnIndex() {
        var $feed = $('.feed-item:not(.mzh)');

        $feed.addClass('mzh');

        if (options.hidename) {
            $feed.find('.avatar').remove();
            $feed.find('.source').remove();
            $feed.find('.zm-item-answer-author-wrap').remove();
            $feed.find('.zm-item-answer-author-info').remove();
            $feed.find('.feed-source').remove();
        }

        if (options.hideupdown) {
            $feed.find('.zm-item-vote').remove();
        }

        if (options.fixbar) {
            $feed.addClass('mzh-fixbar');
            $feed.find('.zm-meta-panel').find('.meta-item:not(.follow-link)').each(function() {
                var $item = $(this);
                var itemName = $item.attr('name');

                if (itemName !== 'favo') {
                    $item.remove();

                    return;
                }

                $item.removeClass('zu-autohide');
            });
        }
    }

    function hideUserInfo() {
        hideOnQuestionPage();
        hideOnIndex();
    }

    function modifyAnswerLinks() {
        $('a.question_link:not(.mzh)').each(function() {
            let $link = $(this)
            let linkArr = $link.attr('href').split('#')
            let newLink = linkArr[0] + '?sort=created#' + (linkArr[1] || '')

            $link.attr('href', newLink).addClass('mzh')
        });
    }

    function fixPage() {
        if (options.hideSidebar) {
            $('.zu-main-sidebar').addClass('mzh-fix-sidebar');
        }
    }

    function init() {
        hideUserInfo()
        modifyAnswerLinks()
        fixPage()
        bindEvents()
    }

    chrome.storage.local.get('options', function(data) {
        options = $.extend(options, data.options);
        init();
    });
});
