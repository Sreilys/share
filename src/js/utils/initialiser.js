/* global jQuery */

/*
 * Initialiser
 * Loop though the Components and instantiate them
 */

this.Share = this.Share || {};
this.Share.Utils = this.Share.Utils || {};
this.Share.Utils.Initialiser = (function ($) {
    'use strict';

    /**
     * Initialise Component
     * @param {object} $element - element using component
     * @param {object} $component - component object
     * @param {string} name - full name of component
     * @param {object} opts - options for this instance
     */
    var initialise = function ($element, $component, name, opts) {
        $component.init($element, name, opts);
    };

    /**
     * Via selector
     * Element(s) via selector, no namespace
     * @param {object} components - object storing component functions
     * @param {object} options - component options
     * @param {string} prefix - identifier for component location e.g. SV for Share
     * @param {string} name - name of the component
     */
    var viaSelector = function (components, options, prefix, name) {
        var $selector = $(options.selector);
        var $component = components[name];
        for (var j = 0; j < $selector.length; ++j) {
            initialise(
                $($selector[j]),
                $component,
                name,
                $.extend({}, {componentPrefix: prefix}, options)
            );
        }
    };

    /**
     * Via namespace
     * Element(s) via namespaced selector
     * @param {object} components - object storing component functions
     * @param {object} options - component options
     * @param {string} prefix - identifier for component location e.g. SV for Share
     * @param {string} name - namespaced name of the component
     */
    var viaNamespace = function (components, options, prefix, name) {
        var splitName = name.split('.');
        var $selector = $(options[splitName[1]].selector);
        var $component = components[splitName[0]];
        for (var k = 0; k < $selector.length; ++k) {
            initialise(
                $($selector[k]),
                $component,
                name,
                $.extend({}, {componentPrefix: prefix}, options[splitName[1]])
            );
        }
    };

    var self = {
        /**
         * Loop through components and initialise
         * @param {object} components - object storing component functions
         * @param {object} config - configuration file for components
         * @param {string} prefix - identifier for component location e.g. SV for Share
         */
        init: function (components, config, prefix) {
            for (var key in components) {
                if (Object.prototype.hasOwnProperty.call(components, key)) {
                    var options = config[key] || {};
                    var $dataAttr = $('[data-component="' + prefix + '.' + key + '"]');

                    // Element exists with matching data-attribute
                    // Optional: namespace
                    if ($dataAttr.length > 0) {
                        for (var i = 0; i < $dataAttr.length; ++i) {
                            var $element = $($dataAttr[i]);
                            var namespace = $element.data('namespace') || null;
                            var opts = $.extend({}, {componentPrefix: prefix}, (namespace && options[namespace]) ? options[namespace] : options);
                            var componentFullname = (namespace) ? key + '.' + namespace : key;
                            var $component = components[key];

                            initialise(
                                $element,
                                $component,
                                componentFullname,
                                opts
                            );
                        }
                    }

                    // Selector exists in options
                    // Optional: namespace
                    if (options.selector) {
                        viaSelector(components, options, prefix, key);
                    } else if (options.namespaced) {
                        for (var keyName in options) {
                            // eslint-disable-next-line max-depth
                            if (typeof options[keyName] === 'object' && options[keyName].selector) {
                                viaNamespace(components, options, prefix, key + '.' + keyName);
                            }
                        }
                    }
                }
            }
        }
    };

    return self;
})(jQuery);
