//Offline Data Store:
Ext.define('Showtime.store.OfflineCourse', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'offlineCourse',
        model: 'Showtime.model.Course',
        proxy: {
            type: 'localstorage',
            id: 'LocalCourses'
        },
        listeners: {
            load: function (store, records, success) {
                console.log('store:Course:offline: loading from offline courses store');
            }
        }
    }
});

//Online Data Store:
Ext.define('Showtime.store.Course', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'onlineCourse',
        model: 'Showtime.model.Course',
        autoLoad: false,
        sorters: 'name',
        pageSize: 50,
        proxy: {
            type: 'jsonp',
            url : 'http://showtime.arts.ac.uk/lcf/ma/2012/courses.json',
            reader: {
                type: 'json',
                rootProperty: 'data.Courses'
            },
            timeout: 2000,
            listeners: {
                exception:function () {
                    //we are offline so use the previously loaded data
                    console.log('store:Course:online: timeout - using old course list');
                    Showtime.store.OfflineCourse.load();
                }
            }
        },
        listeners: {
            load:function (store, records, success) {
                console.log('store:Course:online: loading');

                console.log('store:Course:online: emptying the offline courses store');
                //empty the offline store
                var offlineStore = Ext.getStore('offlineCourse');
                offlineStore.getProxy().clear();

                console.log('store:Course:online: adding ' + records.length + ' course records to the offline store');
                this.each(function(record){
                    //add record to store
                    offlineStore.add(record.data)[0];
                });

                offlineStore.sync();

                //load from the now primed offline store:
                offlineStore.load();
            }
        }
    }
});