/**
 * @file options
 * @author solopea@gmail.com
 */

$(function() {
    function init() {
        var options = {
            maxHeight: 250,
            hidename: true,
            hideupdown: true,
            hideSidebar: true,
            hideComments: true,
            sortByCreated: true,
            showSliderButton: true,
            autoSlider: false
        };
        chrome.storage.local.get('options', function(data) {
            $.extend(options, data.options);

            for (var key in options) {
                var $elem = $('#' + key);

                if ($elem) {
                    if ($elem.attr('type') === 'checkbox') {
                        $elem.get(0).checked = options[key];
                        continue;
                    }
                    $elem.val(options[key]);
                }
            }
        });
    }

    init();

    function onSaveClick() {
        var hidename = $('#hidename').get(0).checked;
        var hideupdown = $('#hideupdown').get(0).checked;
        var hideComments = $('#hideComments').get(0).checked;
        var hideSidebar = $('#hideSidebar').get(0).checked;
        var sortByCreated = $('#sortByCreated').get(0).checked;
        var showSliderButton = $('#showSliderButton').get(0).checked;
        var autoSlider = $('#autoSlider').get(0).checked;

        var data = {
            hidename: hidename,
            hideupdown: hideupdown,
            hideSidebar: hideSidebar,
            hideComments: hideComments,
            sortByCreated: sortByCreated,
            showSliderButton: showSliderButton,
            autoSlider: autoSlider
        };

        save(data);
    }

    function save(data) {
        chrome.storage.local.set({
            options: data

        }, function() {
            alert('保存成功!');
        });
    }

    $('#save').on('click', function() {
        onSaveClick();
    });
});
