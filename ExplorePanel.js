//model that describes the profiles structure
Ext.regModel('Explore', {
    fields: [
        'profilename',
        'fullname',
        'course',
        'thumb'
    ],
    idProperty: 'id'
});

//this panel displays the thumbs on the explore screen
Showtime.ExplorePanel = Ext.extend(Ext.Panel, {
    cls: 'explore-panel',
    // landscape mode - use vertical columns
    landscapeTpl: new Ext.XTemplate(
        '<div class="explore-container">',
            '<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=column>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
								'<div class="box">',
		            			'<img src="{thumb}" />',
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
			'<div class="explore-container">',
				'<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=row>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
		            		'<div class="box">',
		            			'<img src="{thumb}" />',
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
		//setup the toolbar, see Toolbar.js
		this.tbar = new Showtime.Toolbar();	
		//add the toolbar to the panel's docked items
		this.dockedItems = [this.tbar];	
        //set the heading in the toolbar
        this.tbar.setTitle('MA 2011');
        //call the function to hide the backbutton in toolbar.js
        this.tbar.hideBackButton();
		this.tbar.showBrowseButton();
		
        this.addEvents('profileSelected');
        this.enableBubble('profileSelected');
        
        this.monitorOrientation = true;
        
        this.scroll = false;
        this.tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
        
        Showtime.ExplorePanel.superclass.initComponent.call(this);
        
        this.mon(this, "itemtap", this.onItemTap, this);
        this.mon(this, "orientationChange", this.onOrientationChange, this);
    },
    
    afterRender: function() {
    	Showtime.ExplorePanel.superclass.afterRender.apply(this, arguments);
    	this.setOrientation(Ext.getOrientation());
    },
    
    showProfiles: function() {
    	this.removeAll(true);
        this.doLayout();
        
        thepanel = this;
        
        var tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
        
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
                        items.push(rec.data);
                    });
                    
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
                                            	this.enableBubble('profileSelected');
                                            	thepanel.fireEvent('profileSelected', this, component.profileData[index]);
                                            }
                                        }
                                    }, thepanel);
                                },
                                scope: thepanel
                            }
                        });                   	
                    	
                        var renderData = function() {
                        	var tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
                        	tpl.overwrite(component.el, cardData);
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

    },
    
    resetLayout: function() {
    	var thepanel = Ext.getCmp('explore');
        var portrait = Ext.getOrientation() == "portrait",
            newOrientationLayout = portrait ? thepanel.portraitTpl : thepanel.landscapeTpl;

        if (newOrientationLayout != thepanel.orientationLayout) {
        	thepanel.orientationLayout = newOrientationLayout;

            //if (this.imagePanel.ownerCt) {
            //    this.imagePanel.ownerCt.remove(this.imagePanel, false);
            //}
            
        	thepanel.removeAll(true);

            //this.descriptionPanel.flex = portrait ? 4 : 1;

        	thepanel.add.apply(thepanel, newOrientationLayout);
        	thepanel.layout.activeItem = thepanel.items.first();            
        	thepanel.doLayout();
        }
    },
    
    onOrientationChange: function(target, orientation) {
        this.tpl = orientation == "portrait" ? this.portraitTpl : this.landscapeTpl;
        //this.showProfiles();
        var thepanel = Ext.getCmp('explore');
        test = thepanel.items.get(0);
        //console.log(test);
        //carousel = this.items.items[0];
        if (test) {
        	//this.showProfiles();
        	this.doLayout();
        	test.doLayout(); 
        }
    }
});
//add this panel to the component registry
Ext.reg('showtime-explorepanel', Showtime.ExplorePanel);
