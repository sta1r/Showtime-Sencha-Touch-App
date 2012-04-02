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