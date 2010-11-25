Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
		var panel = new Ext.Panel({
            fullscreen: true,
            layout: 'fit',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'First card',
                    handler: function(){
                        var carousel = panel.getComponent('carousel'); 
                        carousel.setActiveItem(0, 'fade');
                    }
                },{
                    text: 'Last Card',
                    handler: function(){
                        var carousel = panel.getComponent('carousel');
                        carousel.setActiveItem(carousel.items.getCount() - 1, 'fade');
                    }
                }]
            }]
        });
		
		Ext.regModel('Card', {
            fields: ['image', 'id']    
        });
        
        var store = new Ext.data.Store({
            model: 'Card',
            proxy: {
                type: 'ajax',
                url: '/showtime/carolpsli.json',
                reader: {
                    type: 'json',
                    root: 'data.Student.Media'
                }
            },
            listeners: {
                single: true,
                datachanged: function(){
                    Ext.getBody().unmask();
                    var items = [];
                    
                    store.each(function(rec){
                        items.push({
                            html: '<div class="image"><img src="'+rec.get('image')+'" /></div>',
                            cls: 'card ' + rec.get('id')
                        });
                    });
                    
                    var carousel = new Ext.Carousel({
                        items: items,
                        itemId: 'carousel'
                    });
                    panel.add(carousel);
                    panel.doLayout();
                }
            }    
        });       
        store.read();
        console.log(store.proxy.reader);
    }
});
