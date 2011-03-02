var templates = {};

templates.profileListLandscape = new Ext.XTemplate(
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
);
templates.profileListPortrait = new Ext.XTemplate(
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
	);


showtime.views.ProfilesList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Profiles'
    }],
    tpl: templates.profileListLandscape,
    /*items: [{
        xtype: 'list',
        store: showtime.stores.profiles,
        itemTpl: '{firstName} {lastName}',
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: showtime.controllers.profiles,
                action: 'view',
                id: record.getId()
            });
        },
        scroll: 'vertical',
        indexBar: true,
        height: 600,
    }],*/
    initComponent: function() {
		thepanel = this;
		
		//this.showProfiles();
		
		Ext.dispatch({
            controller: showtime.controllers.profiles,
            action: 'list'
        });
		
		
		showtime.views.ProfilesList.superclass.initComponent.apply(this, arguments);
    },
    
    /*
     * Load (or reload) profiles into the main carousel
     */
    updateCarousel: function(records) {
    	
		//generate card components
	    var cards = this.createCards(records);
	    
	    thepanel.removeAll(true);
	    carousel = undefined;
	    if (!carousel) {
	    	//new carousel using generated cards
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
	    
    },    
    
    /*
     * Generates carousel card components using supplied data
     */
    createCards: function(records) {
    	//sort the records into arrays with max 8 items each
        var carditems = [], x=0;
        for (var i=0; i<records.length; i++) {
        	if (i % 8 == 0) {
        		x = i / 8;
        		carditems[x] = [];
        	} 
        	carditems[x].push(records[i].data);
        }
        
        //create components for each card
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
                                	Ext.dispatch({
                                        controller: showtime.controllers.profiles,
                                        action: 'view',
                                        profileData: data
                                    });
                                }
                            }
                        }, thepanel);
        				
                    },
                    scope: thepanel
                },
                //setProfile is fired when component's orientation changes:
                setProfile: function(app_profile) {
                	var tpl = app_profile == "tabletPortrait" ? templates.profileListPortrait : templates.profileListLandscape;
                	//redraw card
                	tpl.overwrite(component.el, cardData);
                    component.el.repaint();
                }
            });
        	
            var renderData = function() {
            	//detect current profile
            	var tpl = showtime.getProfile() == "tabletPortrait" ? templates.profileListPortrait : templates.profileListLandscape;
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
        
        //use delegate to add tap event for all cards?
        return cards;
    }
    
   
});