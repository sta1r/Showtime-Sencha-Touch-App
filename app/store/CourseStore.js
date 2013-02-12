Ext.define('Showtime.store.CourseStore', {
    extend: 'Ext.data.Store',
    requires: 'Ext.ux.proxy.JsonPCache',
    config: {
        storeId: 'courseStore',
        model: 'Showtime.model.CourseModel',
        autoLoad: true,
        sorters: 'name',
        pageSize: 50,
        proxy: {
            type: 'jsonpcache',
            cacheKey: 'CourseCache',
            url : 'http://showtime.arts.ac.uk/lcf/ma/2013/courses.json',
            reader: {
                type: 'json',
                rootProperty: 'data.Courses'
            },
            timeout: 2000,
            listeners: {
                exception:function (proxy, response, operation, eOpts) {
                    console.log('exception loading courses');

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