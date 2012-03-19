/**
 * @class Showtime.Main
 * @extends Ext.Panel
 */
Ext.define('Showtime.view.Viewport', {
    extend: 'Ext.Container',
    alias: 'showtime-viewport',
    config: {
        id: 'Main',
        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 1
            }
        },
        fullscreen: true
    }
});