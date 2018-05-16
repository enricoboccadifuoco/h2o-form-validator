/*
    checkbox
    radio
    select

    (input, textarea)       code
        data-validation:
            e-mail          EMAIL
            url             URL
            noProtocolUrl   NO_PROTOCOL_URL
            alphanumeric    ALPHANUMERIC
            number          NUMBER
            alpha           ALPHA

        minlength           MiX_LENGTH
        maxlength           MAX_LENGTH

        required            REQUIRED


*/

(function ( window, document ) {

    function validator ( form ) {

        // If no form provided, use document as fields wrapper
        form = form || document;

        function trigger(eventName, data) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, {detail: data});
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            this.dispatchEvent(event);
        }

        var base = this,
            dictionary = {
                email: {
                    value: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
                    fallback: 'Please provide a valid e-mail address',
                    code: 'EMAIL',
                },
                url: {
                    value: new RegExp(/^https?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/),
                    fallback: 'Please provide a valid URL',
                    code: 'URL',
                },
                noProtocolUrl: {
                    value: new RegExp(/^[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/),
                    fallback: '',
                    code: 'NO_PROTOCOL_URL',
                },
                alphanumeric: {
                    value: new RegExp(/^[a-zA-Z0-9 ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡çÇŒœßØøÅåÆæÞþÐð]*$/),
                    fallback: 'Letters and numbers only, please',
                    code: 'ALPHANUMERIC',
                },
                number: {
                    value: new RegExp(/^[0-9]*$/),
                    fallback: 'Numbers only, please',
                    code: 'NUMBER',
                },
                alpha: {
                    value: new RegExp(/^[a-zA-Z ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡çÇŒœßØøÅåÆæÞþÐð]*$/),
                    fallback: 'Letters only, please',
                    code: 'ALPHA',
                }
            };

        /**
         * {Private} initialize validation
         *
         * @method _init
         *
         */
        base._init = function () {

        };

        /**
         * {Private} trigger Error event
         *
         * @method _error
         *
         * @param {String} msg
         * @param {Object} el
         */
        base._error = function ( code, msg, el ) {

            trigger.call(form, 'error', {
                code: code,
                message: msg,
                el: el
            });
        };

        /**
         * {Private} Validate text throught dictionary regexp
         *
         * @method _validateWithRexExp
         *
         * @param {Object} el
         * @param {Object} dictionary
         */
        base._validateWithRexExp = function ( el, dictionary ) {
            if ( el.value.length < 1 ) {
                return true;
            }

            if( dictionary.value.test( el.value ) ) {
                return true;
            }

            base._error( dictionary.code, dictionary.fallback, el );

            return false;
        };

        /**
         * {Private} Checks form input length
         *
         * @method _validateLength
         *
         * @param {Object} el
         */
        base._validateLength = function ( el ) {

            var maxlength = el.getAttribute('maxlength') || -1,
                minlength = el.getAttribute('minlength') || 0,
                length = el.value.trim().length;

            if ( maxlength > 0 ) {
                if ( length > maxlength ) {
                    base._error( 'MAX_LENGTH', 'This field is too long', el );
                    return false;
                }
            }

            if ( length < minlength ) {
                base._error( 'MIN_LENGTH', 'This field is too short', el );
                return false;
            }

            return true;
        };

        /**
         * {Private} Checks if form input is required
         *
         * @method _validateRequired
         *
         * @param {Object} el
         */
        base._validateRequired = function ( el ) {
            if ( el.getAttribute('required') !== null && base._isEmpty(el) ) {
                base._error( 'REQUIRED', 'This field is required', el );
                return false;
            }
            return true;
        };

        /**
         * {Private} Checks if a ragio group is checked
         *
         * @method _validateRadioGroup
         *
         * @param {String} el
         */
        base._validateRadioGroup = function( radioName ) {
            var radios = form.getElementsByName(radioName);

            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    return true;
                }
            }
            return false;
        };

        /**
         * {Private} Checks if input object is empty
         *
         * @method _isEmpty
         *
         * @param {Object} el
         */
        base._isEmpty = function ( el ) {

            switch ( el.tagName.toLowerCase() ) {

                case 'select' :
                case 'textarea' :
                    return !Boolean(el.value);

                case 'input' :
                    switch ( el.getAttribute('type') ) {

                        case 'radio':
                            var radioName = el.getAttribute('name');

                            if ( radioName !== undefined ) {
                                return !base._validateRadioGroup(radioName);
                            } else {
                                return !el.checked;
                            }
                        break;

                        case 'checkbox':
                            return !el.checked;

                        default:
                            return !Boolean(el.value);
                    }
            }
        };

        /**
         * {Private} Checks if an element is an input (input, textarea, select)
         *
         * @method _isInputish
         *
         * @param {Object} el
         */
        base._isInputish = function ( el ) {
            return [ 'INPUT', 'TEXTAREA', 'SELECT' ].indexOf( el.tagName ) !== -1;
        };

        /**
         * {Public} Starts single form element or entire form validation
         *
         * @method validate
         *
         * @param {Object} el
         */
        base.validate = function ( element ) {

            var isValidated = true,
                selector,
                el,
                elAttribute,
                elDictionary;

            if ( element !== undefined ) {
                selector = [element];
            } else {
                selector = form.querySelectorAll('input, textarea, select');

                // If "form" has no "inputish" children
                // Check if -by chance- "form" is an input itself (single field validation)
                if( selector.length === 0 && base._isInputish( form ) ) {
                    selector = [form];
                }
            }

            // Validate each field
            for ( var i = 0; i < selector.length; i++ ) {

                el = selector[i];

                // Check if field is required.
                // If so, check if it constains something
                if ( !base._validateRequired(el) ) {
                    isValidated = false;
                    continue;
                }

                // Get if field has a "data-validation" attribute
                elAttribute = el.getAttribute('data-validation');

                if ( Boolean(elAttribute) ) {

                    elDictionary = base._selectDictionary(elAttribute);

                    // Check string pattern and length
                    if ( !base._validateWithRexExp( el, elDictionary ) || !base._validateLength( el ) ) {
                        isValidated = false;
                    }
                }
            }

            return isValidated;
        };

        /**
         * {Private} Select the dictionary to based on field type
         *
         * @method _selectDictionary
         *
         * @param {String} elAttribute
         * @return {Object} dictionary object
         */
        base._selectDictionary = function(elAttribute)  {

            return dictionary.hasOwnProperty( elAttribute ) ?
                dictionary[elAttribute] :
                false;
        };

        /**
         * {Public} Register an event listener
         *
         * @method _on
         *
         * @param {Object} eventName (String or array of strings)
         * @param {Function} callback
         */
        base._on = function ( eventName, callback ) {

            if ( Array.isArray( eventName ) ) {

                eventName.forEach( function( event ){
                    base._on( event, callback );
                });

                return false;
            }

            form.addEventListener( eventName, callback );
        };

        /**
         * {Public} Helper functions
         *
         * @object helpers
         */
        var helpers = {

            /**
             * {Public} Add "http://" protocol before a valid url
             *
             * @method addHttp
             *
             * @param {String} url
             */
            addHttp: function( url ) {
                if (dictionary.noProtocolUrl.value.test(url)) {
                    url = 'http://' + url;
                }

                return url;
            }

        };

        return {
            validate: base.validate,
            on: base._on,
            helpers: helpers
        };
    }   // Validator end

    // Isomorphic export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = validator;
    } else {
        window.validator = validator;
    }

})( window, document );