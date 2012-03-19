//create sheet for title/like button - this is reusable by each image
Ext.define('Showtime.view.profile.BottomToolbar', {
    extend: 'Ext.Toolbar',
    config: {
        id: 'bottomToolbar',
        cls:'bottom',
        docked:'bottom',
        overlay:true,
        items:[
            { xtype:'spacer'},
            {
                xtype:'button',
                iconMask:true,
                ui:'plain',
                iconCls:'heart',
                cls:'like',
                handler:function () {
                    Ext.getBody().mask('Liking...', 'x-mask-loading', false);

                    bottomSheet = Ext.getCmp('bottomSheet');
                    Ext.Ajax.request({
                        url:'http://showtime.arts.ac.uk/media/like/' + bottomSheet.data.id,
                        success:function (response, opts) {
                            console.log('You liked media id=' + bottomSheet.data.id);
                            console.log(response);
                            var obj = Ext.decode(response.responseText);
                            console.log(obj);
                            if (obj.success == true) {
                                //console.log('likes='+obj.likes);
                                //like saved successfully
                                // modal to display like count to user
                                likeTerm = obj.likes == 1 ? 'like' : 'likes';
                                this.likeModal = new Ext.Panel({
                                    id:'likeModal',
                                    floating:true,
                                    centered:true,
                                    hidden:true,
                                    modal:true,
                                    height:80,
                                    width:180,
                                    html:obj.likes + ' ' + likeTerm + '!'
                                });
                                likeModal = this.likeModal;
                                likeModal.on('hide', function () {
                                    likeModal.destroy();
                                });
                                likeModal.show('pop');
                            } else {
                                //failed to like
                            }
                            Ext.getBody().unmask();
                        },
                        failure:function (response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                            console.log(response);
                            var msg = Ext.getBody().down('.x-mask-loading');
                            if (msg) {
                                msg.setHTML('Unable to like');
                                console.log('did not receive a response in time');
                                //wait two seconds then unmask:
                                setTimeout(function () {
                                    Ext.getBody().unmask();
                                }, 2000);
                            }
                        }
                    });
                }
            }
        ]
    }
    //add custom animation?
    //place the like button in the items/docked items property here?
    //listener for click to fire ajax on like button
});