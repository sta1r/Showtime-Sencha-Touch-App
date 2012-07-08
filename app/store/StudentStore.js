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
            url : 'http://showtime.arts.ac.uk/lcf/ma/2012/students.json',
            reader: {
                type: 'json',
                rootProperty: 'data.Students'
            },
            timeout: 7000,
            listeners: {
                exception:function (proxy, response, operation, eOpts) {
                    console.log('exception loading student A-Z list');

                    //Ext.ComponentQuery.query('#explore-panel')[0].unmask();

                    if (!navigator.onLine) {
                        //not online
                        //
                    } else {
                        //online so some other error
                        //timeout?
                        //can't connect to showtime server?
                    }
                }
            }
        }
    }
});