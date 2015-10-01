/**
 * @file options
 * @author solopea@gmail.com
 */

$(function() {
    function init() {
        var options = {
            maxHeight: 250,
            hidename: false,
            hideupdown: false,
            hideSidebar: false,
            fixbar: false
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
        var fixbar = $('#fixbar').get(0).checked;
        var hideSidebar = $('#hideSidebar').get(0).checked;

        var data = {
            hidename: hidename,
            hideupdown: hideupdown,
            hideSidebar: hideSidebar,
            fixbar: fixbar
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
