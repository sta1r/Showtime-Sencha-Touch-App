//define a custom toolbar by extending the object
Showtime.Toolbar = Ext.extend(Ext.Toolbar, {
    dock: 'top',
   
    initComponent: function(){
		//Adds the specified events to the list of events which this Observable may fire.
        this.addEvents('back');
        
        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
        
        //define the back button object
        this.backButton = new Ext.Button({
        	//button will appear styled as a back button
            ui: 'back',
            text: 'Back',
            //starts hidden
            hidden: true,
            //function called when the button is clicked
            handler: function() {
        		//fire the back event on the toolbar
                self.fireEvent('back', this);
            }
        });
        
        //specify what appears on the toolbar: back button, spacer (see Ext.Spacer)
        this.items = [
            this.backButton,
            {xtype: 'spacer'}
        ];
        //call parent initComponent: because this class is an extended toolbar, the toolbar init needs to be called also:
        Showtime.Toolbar.superclass.initComponent.call(this);       
    },
    
    showBackButton: function() {
        this.backButton.show();
        //refresh the layout
        this.doComponentLayout();
    },
    
	//function called by ShowHome in MasterPanel - hides back button
    hideBackButton: function() {
        this.backButton.hide();
      //refresh the layout
        this.doComponentLayout();
    }
    
});
//add the toolbar to the component registry
Ext.reg('showtime-toolbar', Showtime.Toolbar);
