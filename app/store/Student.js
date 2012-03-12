//Offline Data Store:
Ext.define('Showtime.store.OfflineStudent', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'offlineStudent',
        model: 'Showtime.model.Profile',
        proxy: {
            type: 'localstorage',
            id: 'LocalStudents'
        },
        grouper: {
            groupFn: function(record) {
                return record.get('firstName')[0];
            }
        },
        listeners: {
            load: function (store, records, success) {
                console.log('store:Student:offline: loading from offline students store');
            }
        }
    }
});

//Online Student List Data Store:
Ext.define('Showtime.store.Student', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'onlineStudent',
        model: 'Showtime.model.Profile',
        autoLoad: false,
        sorters: 'firstName',
        pageSize: 1,
        proxy: {
            type: 'jsonp',
            url : 'http://showtime.arts.ac.uk/lcf/ma/2012/students.json',
            reader: {
                type: 'json',
                rootProperty: 'data.Students'
            },
            timeout: 7000,
            listeners: {
                exception:function () {
                    //we are offline so use the previously loaded data
                    console.log('store:Student:online: offline - using old student list');
                    var offlineStore = Ext.getStore('offlineStudent');
                    offlineStore.load();

                    if(networkState == 'unknown') {
                        Ext.Msg.alert('Offline', 'Could not connect - internet connection required');
                    } else {
                        Ext.Msg.alert('Connection timed out', 'Sorry, could not reach the Showtime server, please try later');
                    }
                }
            }
        },
        listeners: {
            load:function (store, records, success) {
                console.log('store:Student:online: fetching student json feed from server');

                console.log('store:Student:online: emptying the offline student store');
                //empty the offline store
                var offlineStore = Ext.getStore('offlineStudent');
                offlineStore.getProxy().clear();

                console.log('store:Student:online: adding ' + records.length + ' student records');
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