(function(_win) {
    'use strict';

    if ('IntersectionObserver' in _win) {
        return;
    }

    /**
     * IntersectionObserver polyfill (c) 2016 @jeremenichelli | Licensed MIT
     */
    var viewportH = _win.innerHeight,
        nowOffset = Date.now();

    // error headers
    var constructError = 'Failed to construct \'Intersection\': ',
        observeError = 'Failed to execute \'observe\': ',
        unobserveError = 'Failed to execute \'unobserve\': ';

    // requestAnimationFrame alias
    var rAF = _win.requestAnimationFrame;

    /**
     * Returns current time
     * @method now
     * @returns {Number} Execution time
     */
    var now = function() {
        return _win.performance && _win.performance.now ? performance.now() : Date.now() - nowOffset;
    };

    /*
     * Observer constructor
     * @constructor IntersectionObserver
     * @param {Function} callback
     * @param {Object} options
     */
    var IntersectionObserver = function(callback, options) {
        var that = this;

        // throw error if callback is not a funciton
        if (typeof callback !== 'function') {
            throw new TypeError(constructError + 'The callback provided as parameter 1 is not a function');
        }

        this.root = options.root || null;
        this.threshold = options.threshold || [0];

        // accept number as threshold option
        if (typeof this.threshold === 'number') {
            this.threshold = [ this.threshold ];
        }

        // throw error when threshold value is out of range
        if (this.threshold[0] > 1 || this.threshold[0] < 0) {
            throw new RangeError(constructError + 'Threshold values must be between 0 and 1');
        }

        // create array for observable elements
        var elements = [];

        // debounce frame call
        var ticking = false;

        // trigger actions when elements become visible
        function trigger(target) {
            var arr = target ? [ target ] : elements,
                count = arr.length,
                changes = [],
                el,
                rect;

            while (count) {
                --count;

                el = arr[ count ];
                rect = el.getBoundingClientRect();

                if (rect.top < viewportH && rect.top >= -rect.height) {
                    changes.push({
                        boundingClientRect: rect,
                        target: el,
                        time: now()
                    });
                }
            }

            // execute callback with array of changes and reference to the observer
            callback.apply(that, [changes, that]);

            // clean variables to prevent memory leaks
            arr = count = changes = el = rect = null;

            // reset ticking
            ticking = false;
        }

        function debounceTrigger() {
            if (!ticking) {
                rAF(trigger.bind(_win, null));
            }
            ticking = true;
        }

        // add element to array of observable elements
        this.observe = function(target) {
            if (target instanceof _win.Element) {
                // reincorporate scroll listener if array is empty
                if (elements.length === 0) {
                    _win.addEventListener('scroll', debounceTrigger);
                }

                elements.push(target);

                // trigger in case element is already visible
                  trigger(target);
            } else {
                throw new TypeError(observeError + 'parameter 1 is not of type \'Element\'');
            }
        };

        // remove element from array of observable elements
        this.unobserve = function(target) {
            if (target instanceof _win.Element) {
                var index = elements.indexOf(target);

                if (index !== -1) {
                    elements.splice(index, 1);
                }

                // remove scroll listener array is empty
                if (elements.length === 0) {
                    _win.removeEventListener('scroll', debounceTrigger);
                }
            } else {
                throw new TypeError(unobserveError + 'parameter 1 is not of type \'Element\'');
            }
        };

        // stop observing
        this.disconnect = function() {
            _win.removeEventListener('scroll', debounceTrigger);
        };
    };

    // update viewport metrics
    _win.addEventListener('resize', function() {
        viewportH = _win.innerHeight;
    });

    // expose constructor globally
    _win.IntersectionObserver = IntersectionObserver;

})(window);
