Ext.define('Showtime.store.StudentStore', {
    extend: 'Ext.data.Store',
    requires: 'Ext.ux.proxy.JsonPCache',
    config: {
        storeId: 'studentAZStore',
        model: 'Showtime.model.ProfileModel',
        autoLoad: true,
        sorters: 'firstName',
        pageSize: 1,
        grouper: {
            groupFn: function(record) {
                return record.get('firstName')[0];
            }
        },
        proxy: {
            type: 'jsonpcache',
            cacheKey: 'StudentAZCache',
            url : 'http://showtime.arts.ac.uk/lcf/ug/2012/students.json',
            reader: {
                type: 'json',
                rootProperty: 'data.Students'
            },
            timeout: 7000,
            listeners: {
                exception:function () {
                    //we are offline

                    if(networkState == 'unknown') {
                        Ext.Msg.alert('Offline', 'Could not connect - internet connection required');
                    } else {
                        Ext.Msg.alert('Connection timed out', 'Sorry, could not reach the Showtime server, please try later');
                    }
                }
            }
        }
    }
});