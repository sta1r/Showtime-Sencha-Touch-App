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
    tpl: templates.profileListLandscape,
    initComponent: function() {
		thepanel = this;

		//use custom toolbar
		this.tbar = new showtime.ProfilesListToolbar();
		this.tbar.setTitle('MA_11');
		//add the toolbar to the panel's docked items
		this.dockedItems = [this.tbar];
		
		//load profiles list into store
		Ext.dispatch({
            controller: showtime.controllers.profiles,
            action: 'load'
        });
		//load course info
        Ext.dispatch({
            controller: showtime.controllers.courses,
            action: 'list'
        });       
        
		showtime.views.ProfilesList.superclass.initComponent.apply(this, arguments);
    },
    
    /*
     * Load (or reload) profiles into the main carousel
     */
    loadProfiles: function(records, courseData) {
	    
	    this.removeAll(true);
	    
	    if (courseData) {
	    	this.tbar.setTitle(courseData.name);
	    	this.tbar.backButton.show();
	    } else {
	    	this.tbar.setTitle('MA_11');
	    }
	    
	    //generate card components for main carousel
	    var cards = this.createCards(records);
	    
	    if (carousel) {
	    	carousel.hide();
	    }
	    carousel = undefined;
	    if (!carousel) {
	    	//new carousel using generated cards
	        var carousel = new Ext.Carousel({
	        	fullscreen: true,
	        	hidden: true,
	        	layout: 'fit',
	        	flex: 1,
	        	items: cards,
	        	id: 'car',
	            itemId: 'carousel',
	            listeners: {
	        		el: {
	        			//using delegate for better memory management
		        		tap: function(e, target) {
		        			if (target) {
		        				var carousel_item = carousel.items.items[carousel.getActiveIndex()];
			        			var index = carousel.items.items[carousel.getActiveIndex()].items.indexOf(target);
			        			var data = carousel_item.profileData[index];
                                if (Ext.isObject(data)) {
                                	Ext.dispatch({
                                        controller: showtime.controllers.profiles,
                                        action: 'view',
                                        profileData: data
                                    });
                                }
                            }
		        		},
		        		delegate: '.explore-item'
	        		}
	        	}
	        });
	    }
	    this.add(carousel);
	    this.doLayout();
	    carousel.show('fade');
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

                //setProfile is fired when component's orientation changes:
                //TODO re-attach tap events as they are lost on orientation change
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