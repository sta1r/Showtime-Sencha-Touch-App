//create sheet for title/like button - this is reusable by each image
Ext.define('Showtime.view.profile.BottomToolbar', {
    extend: 'Ext.Toolbar',
    config: {
        id: 'bottom-toolbar',
        cls:'bottom',
        docked:'bottom',
        bottom: 0,
        left: 0,
        width: '100%',
        items:[
            { xtype:'spacer'},
            {
                xtype:'button',
                id: 'likeButton',
                iconMask:true,
                ui:'plain',
                iconCls:'heart',
                cls:'like'
            }
        ]
    }
    //add custom animation?
    //place the like button in the items/docked items property here?
    //listener for click to fire ajax on like button
});