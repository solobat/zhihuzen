$(function() {
    var CONST = {
        FOLD: '收起',
        UNFOLD: '展开'
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

    function fixAnswer() {
        $('.zm-votebar').each(function() {
            var $this = $(this);
            if ($this.find('.mzh-btn').length) {
                return;
            }

            var $answer = $this.closest('.zm-item-answer');

            if ($answer.height() < options.maxHeight) {
                return;
            }

            var aid = $answer.data('aid');
            var $btn = $('<button class="mzh-btn mzh-btn-cls">' + CONST.FOLD + '</button>').data('aid', aid);

            $this.append($btn);

        });
    }

    function btnToggle(elem) {
        var $elem = $(elem);
        var aid = $elem.data('aid');
        var $answer = $('.zm-item-answer[data-aid=' + aid + ']');
        var $text = $answer.find('.zm-item-rich-text');

        // 暂时只能直接隐藏掉，直接设置text高度会与知乎本身的功能起冲突
        // 可以考虑新生成一个summary放到text原本的位置
        if ($text.css('display') === 'none') {
            $text.show();
            $elem.text(CONST.FOLD);
        } else {
            $text.hide();
            $elem.text(CONST.UNFOLD);

            // 自动滚到下一个答案
            setTimeout(function() {
                var scrollToY = $answer.next().offset().top - toolbarH;

                window.scrollTo(0, scrollToY);
            }, 0);
        }
    }


    function bindEvents() {
        // 折叠区展开后添加按钮
        $('#zh-question-collapsed-link').on('click', function() {
            fixAnswer();
        });

        $('#zh-question-answer-wrap, #zh-question-collapsed-wrap').on('DOMSubtreeModified', function () {
            fixAnswer();
            hideUserInfo();
        });

        $(document).on('click', '.mzh-btn-cls', function() {
            btnToggle(this);
        });

        $(document).on('click', '.zh-summary', function() {
            $(this).closest('.feed-main').find('.zm-votebar').hide();
        });

        $('#js-home-feed-list').on('DOMSubtreeModified', function () {
            hideOnIndex();
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
            $answer.find('.zm-votebar').find('.up,.down').hide();
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

    function fixPage() {
        if (options.hideSidebar) {
            $('.zu-main-sidebar').addClass('mzh-fix-sidebar');
        }
    }

    function init() {
        fixAnswer();
        hideUserInfo();
        fixPage();

        bindEvents();
    }

    chrome.storage.sync.get('options', function(data) {
        options = $.extend(options, data.options);
        init();
    });
});
