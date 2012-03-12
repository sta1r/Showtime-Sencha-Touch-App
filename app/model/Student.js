/**
 * @class Student
 * @extends Ext.data.Model
 * Model for an individual student profile (used in form)
 */
Ext.define('Showtime.model.Student', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'firstname', type: 'string'},
            {name: 'lastname',  type: 'string'},
            {name: 'profileurl',type: 'string'},
            {name: 'shorturl',  type: 'string'},
        ]
    }
});