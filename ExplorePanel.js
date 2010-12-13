//model that describes the profiles structure
Ext.regModel('Explore', {
    fields: [
        'profilename',
        'fullname',
        'course',
        'hero'
    ],
    idProperty: 'id'
});

//this panel displays the thumbs on the explore screen
Showtime.ExplorePanel = Ext.extend(Ext.Panel, {
    cls: 'explore-panel',
    // landscape mode - use vertical columns
    landscapeTpl: new Ext.XTemplate(
        '<div class="explore-container" style="height: 100%">',
            '<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=column>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
								'<div class="box">',
		            			'<img src="{hero}" />',
								'</div',
							'</div>',
							'<div class="caption">',
								//'<span>Student {#} of {[xcount]}</span>',
								'<span>{fullname}{#}</span>',
								'<span>{course}</span>',
							'</div>',
						'</div>',
					'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
    			'</tpl>',
        '</div>'
    ),
    // portrait mode - use horizontal rows
    portraitTpl: new Ext.XTemplate(
			'<div class="explore-container" style="height: 100%">',
				'<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=row>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
		            		'<div class="box">',
		            			'<img src="{hero}" />',
								'</div',
							'</div>',
							'<div class="caption">',
								'<span>Student {#} of {[xcount]}</span>',
								'<span>{course}</span>',
							'</div>',
						'</div>',
					'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
   			'</tpl>',
			'</div>'    
	),
    
    initComponent: function() {
        this.addEvents('profileSelected');
        this.enableBubble('profileSelected');
        
        this.monitorOrientation = true;
        this.scroll = false;
        this.tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
        //this.fullscreen = true;
        
        var store = new Ext.data.Store({
            model: 'Explore',
            proxy: {
                type: 'ajax',
                url: '/showtime/explore.json',
                reader: {
                    type: 'json',
                    root: 'data.Profiles'
                }
            },
            listeners: {
                single: true,
                datachanged: function(){
                    Ext.getBody().unmask();
                    var items = [];
                    
                    store.each(function(rec){
                        items.push(
                    		//{
                    		//	html: '<div class="chris">'+rec.data.fullname+'</div>'
                    		//}
                        	rec.data
                        );
                    });
                    
                    thepanel = Ext.getCmp('explore');
                    
                    var carditems = [];
                    
                    var x=0;
                    for (var i=0; i<items.length; i++) {
                    	if (i % 8 == 0) {
                    		x = i / 8;
                    		carditems[x] = [];
                    	} 
                    	carditems[x].push(items[i]);
                    }

                    //collection of components
                    var cards = [];
                    
                    Ext.each(carditems, function(cardData){
                    	var component = new Ext.Component({
                        	profileData: cardData,
                        	listeners: {
                                afterrender: function() {
                    				thepanel.mon(component.el, 'tap', function(e) {
                                        var item = e.getTarget('.explore-item', component.el);
                                        if (item) {
                                            var index = component.items.indexOf(item),
                                                data = component.profileData[index];
                                            
                                            if (Ext.isObject(data)) {
                                            	thepanel.fireEvent('profileSelected', this, component.profileData[index]);
                                            }
                                        }
                                    }, thepanel);
                                },
                                scope: thepanel
                            }
                        });
                        
                        var renderData = function() {
                        	thepanel.tpl.overwrite(component.el, cardData);
                            component.el.repaint();
                            component.items = new Ext.CompositeElementLite();
                            component.items.fill(Ext.query('.explore-item', component.el.dom));
                        };
                        
                        if (component.rendered) {
                            renderData();
                        }
                        else {
                            component.on('render', renderData, thepanel, {single: true});
                        }
                        
                        cards.push(component);
                    });
                                    
                    
                    
                    var carousel = new Ext.Carousel({
                    	fullscreen: true,
                    	layout: 'fit',
                    	flex: 1,
                    	//tpl: thepanel.tpl,
                        //items: items,
                    	items: cards,
                        itemId: 'carousel'
                    });
                    
                    thepanel.add(carousel);
                    thepanel.doLayout();
                }
            },
            pageSize: 50,
            autoLoad: true
        });
        store.read();
        
        //this is important - the dataview will not work if the selector is invalid - here it is set to each thumb div
        //this.itemSelector = '.thumbnail';
        
        /*var makeJSONPRequest = function() {
            Ext.getBody().mask('Loading...', 'x-mask-loading', false);
            Ext.util.JSONP.request({
                url: '/showtime/explore.json',
                callbackKey: 'callback',
                params: {                    
                    page: 1
                },
                callback: function(result) {
                    /*var weather = result.data.weather;
                    if (weather) {
                        var html = tpl.applyTemplate(weather);
                        Ext.getCmp('content').update(html);                        
                    }
                    else {
                        alert('There was an error retrieving the weather.');
                    }
                    Ext.getCmp('status').setTitle('Palo Alto, CA Weather');
                    Ext.getBody().unmask();
                }
            });
        };	
        
        makeJSONPRequest();*/
        
        Showtime.ExplorePanel.superclass.initComponent.call(this);
        
        this.mon(this, "itemtap", this.onItemTap, this);
        this.mon(this, "orientationChange", this.onOrientation, this);
    },
    
    afterRender: function() {
    	Showtime.ExplorePanel.superclass.afterRender.apply(this, arguments);
    },
    
    onOrientation: function(target, orientation) {
        this.tpl = orientation == "portrait" ? this.portraitTpl : this.landscapeTpl;
        this.refresh();
    },
    
    //fired when profile is tapped
    /*handleItemTap: function(dv, idx, el, e){
        var record = this.store.getAt(idx),
            //profile = record.get('profilename');
        	profile = record.data;
        //alert(record);
        //this.fireEvent('profileSelected', this, profile);
        console.log('tapped');
        console.log(this.store.currentPage);
    },
    //fired when explore panel swiped
    handlePanelSwipe: function(e) {
    	console.log('swiped');
    	console.log(this.store.currentPage);
    	this.store.nextPage();
    	console.log(this.store.currentPage);
    }	*/
});
//add this panel to the component registry
Ext.reg('showtime-explorepanel', Showtime.ExplorePanel);
