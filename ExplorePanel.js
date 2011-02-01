//model that describes the profiles structure
Ext.regModel('Explore', {
    fields: [
        'profileName',
        'firstName',
        'lastName',
        'fullName',
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
        '<div class="land explore-container">',
            '<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=column>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
								'<div class="box">',
		            			'<img src="{thumb}" />',
								'</div',
							'</div>',
							'<div class="caption">',
								'<span class="fullname">{fullName}</span>',
								'<span class="course">{course}</span>',
							'</div>',
						'</div>',
					'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
    			'</tpl>',
        '</div>'
    ),
    // portrait mode - use horizontal rows
    portraitTpl: new Ext.XTemplate(
			'<div class="vert explore-container">',
				'<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=row>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
		            		'<div class="box">',
		            			'<img src="{thumb}" />',
								'</div',
							'</div>',
							'<div class="caption">',
								'<span class="fullname">{fullName}</span>',
								'<span class="course">{course}</span>',
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
        //this.tbar.setTitle('<img src="/showtime/img/touch/ma_11.png"/>');
        this.tbar.setTitle('MA_11');
        //call the function to hide the backbutton in toolbar.js
        this.tbar.hideBackButton();
		this.tbar.showBrowseButton();
		this.tbar.showInfoButton();
		//this.tbar.showRefreshButton();
		//bubble up the info button tap
		this.tbar.enableBubble('info');
		this.mon(this, 'info', this.onInfo, this);
        
        this.scroll = false;
        
        this.tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
        this.monitorOrientation = true;
        
        this.layout = "card";
        
        Showtime.ExplorePanel.superclass.initComponent.call(this);
        
        this.addEvents('profileSelected');
        this.enableBubble('profileSelected');
        this.mon(this, "itemtap", this.onItemTap, this);
        //this.mon(this, "orientationChange", this.resetLayout, this);
        
        this.showProfiles();

		//panel to display generic about message & credit
		this.infoPanel = new Ext.Panel({
			id: 'info',
			html: '<div id="description">' 
				+ '<h4>Welcome to MA_11</h4>' 
				+ '<p>We are delighted to present a digital showcase of new work from the London College of Fashion Graduate School.</p>'
				+ '<p>Please show your appreciation for this wonderful work by <strong>liking</strong> individual images and <strong>bookmarking</strong> your favourite student profiles. Bookmark links will be emailed to you for later browsing.</p>'
				+ '<p>Designed to be an interactive, portable companion to the physical exhibitions, this app was created from Showtime, a web-based portfolio platform offered to all graduating students at University of the Arts London.</p>'
				+ '<hr>'
				+ '<p>iPad app design and development by Chris Toppon and Alastair Mucklow.</p>'
				+ '<p>Soon to be available on the App Store.</p>'
				+ '</div>',
			floating: true,
			centered: true,
			modal: true,
			hidden: false,
			height: 450,
			width: 500,
			styleHtmlContent: true,
            scroll: 'vertical',
            listeners: {
				body: {
					click: function(e) {
						//prevent links in the profile description opening safari
						e.stopEvent(true);
					},
					delegate: 'a'
				}
			}
		});
    },
    
    afterRender: function() {
    	Showtime.ExplorePanel.superclass.afterRender.apply(this, arguments);
    	//this.onOrientationChange();
    },
    
    showProfiles: function(course) {
    	this.removeAll(true);
        this.doLayout();
        
        thepanel = this;
        
        var tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
        
        var filter = '';
        if (course) {
        	this.tbar.setTitle(course.name);
        	this.tbar.showBackButton();
        	this.tbar.hideRefreshButton();
        	//this.tbar.hideBrowseButton();
        	this.tbar.enableBubble('back');
	        this.mon(this, 'back', this.onBack, this);
        	url = '/showtime/lcf/'+course.slug+'/2011/explore.json';
        } else {
        	url = '/showtime/lcf/ma/2011/explore.json';
        }
        
    	var store = new Ext.data.Store({
            model: 'Explore',
            proxy: {
                type: 'ajax',
                url: url,
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
                        	//showAnimation: 'fade',
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
                                    
                    thepanel.removeAll(true);
                    carousel = undefined;
                    if (!carousel) {
	                    var carousel = new Ext.Carousel({
	                    	fullscreen: true,
	                    	layout: 'fit',
	                    	flex: 1,
	                    	//tpl: thepanel.tpl,
	                    	items: cards,
	                    	id: 'car',
	                        itemId: 'carousel'
	                    });
                    }
                    thepanel.add(carousel);
                    thepanel.doLayout();
                }
            },
            pageSize: 120,
            //autoLoad: true
        });
        store.read();

    },

    onOrientationChange: function() {
    	orientation = Ext.getOrientation();
    	var portrait = Ext.getOrientation() == "portrait",
    	explorepanel = this;
        newOrientationTpl = portrait ? this.portraitTpl : this.landscapeTpl;
    	
        //console.log(explorepanel.tpl);
        
    	if (newOrientationTpl != this.orientationTpl) {
    		
            this.orientationTpl = newOrientationTpl;

    		//this.tpl = this.landscapeTpl;
    		self = this;
    		c = Ext.getCmp('car');
    		
    		if (orientation == "portrait") {
    			explorepanel.tpl = explorepanel.portraitTpl;
    			//explorepanel.tpl.overwrite(component.el, cardData);
                //component.el.repaint();
    			//c.setWidth(768);c.setHeight(1024);
    		}
    		else {
    			explorepanel.tpl = explorepanel.landscapeTpl;
    			//tpl.overwrite(component.el, cardData);
                //component.el.repaint();
    			//c.setWidth(1024);c.setHeight(768);
    		}
    		explorepanel.doLayout();
    		c.doComponentLayout();
    		
    		//console.log(explorepanel.tpl);
    		
    		Ext.each(c.items.items, function(component){
    			cardData = component.profileData;
    			var renderData = function() {
                	var tpl = newOrientationTpl;
                	tpl.overwrite(component.el, cardData);
                    component.el.repaint();
                    component.items = new Ext.CompositeElementLite();
                    component.items.fill(Ext.query('.explore-item', component.el.dom));
                };
                component.clearListeners();
                if (component.rendered) {
                    renderData();
                }
                else {
                    component.mon('render', renderData, self, {single: true});
                }
    		}, this);
    		
			c.doComponentLayout();
			explorepanel.doComponentLayout();
    	}	
    },
    
    onBack: function() {
    	this.showProfiles();
    	this.tbar.setTitle('MA_11');
    	this.tbar.hideBackButton();
		this.tbar.showBrowseButton();
		//this.tbar.showRefreshButton();
	},
	
	onInfo: function() {
		this.infoPanel.show();
	}
});
//add this panel to the component registry
Ext.reg('showtime-explorepanel', Showtime.ExplorePanel);
