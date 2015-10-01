(function ($, exports) {
    'use strict'
    var MZH = window.MZH || {};

    var events = {
        _bind: function (eventType, handle) {
            this.o.bind.apply(this.o, [
                eventType,
                $.proxy(handle, this)
            ]);
            return this;
        },

        on: function (eventName, handle) {
            var self = this;
            var eventObj = {};

            if (typeof eventName !== 'object') {
                eventObj[eventName] = handle;
            } else {
                eventObj = eventName;
            }

            $.each(eventObj, function (eventType, handle) {
                self._bind(eventType, handle);
            });

            return this;
        },

        trigger: function () {
            this.o.trigger.apply(this.o, arguments);
            return this;
        }
    };

    MZH.mixinEvents = function (target) {
        target.o = $({});
        $.extend(target, events);
    };

    exports.MZH = MZH;

})(jQuery, window);
