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

    function fixAnswer() {
        $('.zm-votebar').each(function() {
            var $this = $(this);
            if ($this.find('.mzh-btn').length) {
                return;
            }

            if ($this.closest('.zm-item-answer').height() < options.maxHeight) {
                return;
            }

            var btnBar = new BtnBar($this);
        });
    }

    class BtnBar {
        constructor($bar) {
            this.$bar = $bar;
            this.$answer = $bar.closest('.zm-item-answer');
            this.$text = this.$answer.find('.zm-item-rich-text');
            this.$imgs = this.$answer.find('img.origin_image');
            this.aid = this.$answer.data('aid');
            this.init();
        }

        init() {
            this.createBtns();
            this.bindEvents();
        }

        createBtns() {
            this.$foldBtn = $('<button class="mzh-btn mzh-btn-fold">' + CONF.FOLD + '</button>');
            this.$bar.append(this.$foldBtn);

            if (!this.$imgs.length) {
                return;
            }

            this.$imgBtn = $('<button class="mzh-btn mzh-btn-hasimg">' + CONF.HASIMG + '</button>');
            this.$bar.append(this.$imgBtn);
            this.refreshImgs(false);
        }

        bindEvents() {
            this.$bar.on('click', '.mzh-btn-fold', this.refreshAnswer.bind(this));
            this.$bar.on('click', '.mzh-btn-hasimg', this.refreshImgs.bind(this, true));
            this.$bar.on('click', '.mzh-btn-noimg', this.refreshImgs.bind(this, false));
            this.$answer.on('click', '.mzh-btn-showimg', this.showImg);
        }

        refreshAnswer() {
            if (!this.$text.is(':visible')) {
                this.$text.show();
                this.$foldBtn.text(CONF.FOLD);
            } else {
                this.$text.hide();
                this.$foldBtn.text(CONF.UNFOLD);

                requestAnimationFrame(() => {
                    var scrollToY = this.$answer.next().offset().top - toolbarH;

                    window.scrollTo(0, scrollToY);
                });
            }
        }

        initImgs() {
            var self = this;

            this.$imgs.each(function () {
                var $img = $(this);
                $('<button class="mzh-btn-showimg" style="display:none">' + CONF.SHOWIMG + '</button>').insertBefore($img);
            });
            this.isImgsInit = true;                  
        }

        refreshImgs(hasImg) {
            if (hasImg) {
                this.$imgBtn.text(CONF.NOIMG).removeClass('mzh-btn-hasimg').addClass('mzh-btn-noimg');
                this.$imgs.show().each(function () {
                    var $img = $(this);
                    $img.attr('src', $img.data('original'));
                });

                this.$answer.find('.mzh-btn-showimg').hide();
                return;
            }

            if (!this.isImgsInit) {
                this.initImgs();
            }

            this.$answer.find('.mzh-btn-showimg').show();
            this.$imgs.hide();
            this.$imgBtn.text(CONF.HASIMG).removeClass('mzh-btn-noimg').addClass('mzh-btn-hasimg');
        }

        showImg() {
            var $img = $(this).next('img');
            var $btn = $(this);

            if (!$img.is(':visible')) {
                $img.show();
                $img.attr('src', $img.data('original'));
                $btn.text(CONF.HIDEIMG);

                return;
            }

            $img.hide();
            $btn.text(CONF.SHOWIMG);
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

    chrome.storage.local.get('options', function(data) {
        options = $.extend(options, data.options);
        init();
    });
});
