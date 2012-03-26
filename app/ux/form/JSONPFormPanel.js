/**
 * Ext.ux.JSONPFormPanel Extension Class
 *
 * @author Chris Toppon
 * @version 0.1
 *
 * @class Ext.ux.JSONPFormPanel
 * @extends Ext.form.FormPanel
 * @constructor
 * @param {Object} config Configuration options
 */

/**
 * Performs a Ajax-based submission of form values (if standardSubmit is false) or otherwise
 * executes a standard HTML Form submit action.
 *
 * @param {Object} options
 * The configuration when submiting this form.
 *
 * @param {String} options.url
 * The url for the action (defaults to the form's {@link #url}).
 *
 * @param {String} options.method
 * The form method to use (defaults to the form's {@link #method}, or POST if not defined).
 *
 * @param {String/Object} params
 * The params to pass when submitting this form (defaults to this forms {@link #baseParams}).
 * Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.
 *
 * @param {Object} headers
 * Request headers to set for the action
 *
 * @param {Boolean} autoAbort
 * `true` to abort any pending Ajax request prior to submission (defaults to false)
 * **Note:** Has no effect when {@link #standardSubmit} is enabled.
 *
 * @param {Boolean} options.submitDisabled
 * `true` to submit all fields regardless of disabled state (defaults to false).
 * Note: Has no effect when {@link #standardSubmit} is enabled.
 *
 * @param {String/Object} waitMsg
 * If specified, the value which is passed to the loading {@link #masked mask}. See {@link #masked} for
 * more information.
 *
 * @param {Function} options.success
 * The callback that will be invoked after a successful response. A response is successful if
 * a response is received from the server and is a JSON object where the success property is set
 * to true, {"success": true}
 *
 * The function is passed the following parameters:
 *
 * @param {Ext.form.Panel} options.success.form
 * The form that requested the action
 *
 * @param {Ext.form.Panel} options.success.result
 * The result object returned by the server as a result of the submit request.
 *
 * @param {Function} options.failure
 * The callback that will be invoked after a failed transaction attempt.
 *
 * The function is passed the following parameters:
 *
 * @param {Ext.form.Panel} options.failure.form
 * The {@link Ext.form.Panel} that requested the submit.
 *
 * @param {Ext.form.Panel} options.failure.result
 * The failed response or result object returned by the server which performed the operation.
 *
 * @param {Object} options.scope
 * The scope in which to call the callback functions (The this reference for the callback functions).=
 *
 * @return {Ext.data.Connection} The request object
 */
//extend
Ext.define('Ext.ux.form.JsonPFormPanel', {
    extend: 'Ext.form.FormPanel',
	submit: function(options) {
        var me = this,
            form = me.element.dom || {},
            formValues;

        options = Ext.apply({
            url : me.getUrl() || form.action,
            callbackKey: 'callback',
            submit: false,
            method : me.getMethod() || form.method || 'post',
            autoAbort : false,
            params : null,
            waitMsg : null,
            headers : null,
            success : null,
            failure : null
        }, options || {});

        formValues = me.getValues(me.getStandardSubmit() || !options.submitDisabled);

        return me.fireAction('beforesubmit', [me, formValues, options], 'doBeforeSubmit');
	},
    doBeforeSubmit: function(me, formValues, options) {
        var form = me.element.dom || {};

        if (me.getStandardSubmit()) {
            if (options.url && Ext.isEmpty(form.action)) {
                form.action = options.url;
            }

            form.method = (options.method || form.method).toLowerCase();
            form.submit();
        }
        else {
            if (options.waitMsg) {
                me.setMasked(options.waitMsg);
            }

            return Ext.data.JsonP.request({
                url     : options.url,
                params  : formValues,
                timeout: options.timeout,
                callbackKey: options.callbackKey,
                callbackName: options.callbackName,
                callback : function(success, response) {
                    var me = this,
                        responseText = response.responseText,
                        failureFn;

                    me.setMasked(false);

                    failureFn = function() {
                        if (Ext.isFunction(options.failure)) {
                            options.failure.call(options.scope || me, me, response, responseText);
                        }
                        me.fireEvent('exception', me, response);
                    };

                    if (success) {

                        response = Ext.decode(responseText);
                        if (success) {
                            if (Ext.isFunction(options.success)) {
                                options.success.call(options.scope || me, me, response, responseText);
                            }
                            me.fireEvent('submit', me, response);
                        } else {
                            failureFn();
                        }
                    } else {
                        failureFn;
                    }
                },
                scope : me
            });
        }
    }
});