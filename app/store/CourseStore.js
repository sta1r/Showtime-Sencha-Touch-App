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
                exception:function () {
                    //we are offline so use the previously loaded data
                    console.log('store:Course:online: timeout - using old course list');
                }
            }
        }
    }
});