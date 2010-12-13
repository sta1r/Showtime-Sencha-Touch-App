Ext.ns("Showtime");

Showtime.APIService = new (Ext.extend(Object, {
    constructor: function() {
        this.baseUrl = "/showtime/";
    },
    
    fetch: function(params, cb, scope) {
        this.request('explore', params, cb, scope);
    },

    request: function(api, params, cb, scope) {
        params = params || {};
        
        var url = this.baseUrl + api + '.json';
        url = Ext.urlAppend(url, Ext.urlEncode(params));
        
        result = {data: 'test'};

        Ext.util.JSONP.request({
            url: url,
            callbackKey: 'callback',
            params: {page:1},
            callback: function(result) {
            	if (typeof cb == "function") {
            		success = true;
            		result.totalCount = 123;
                    cb.call(scope, success, result);
                }             
            }
        });
    }
}))();
