/**
 * @class Student
 * @extends Ext.data.Model
 * Model for an individual student profile (used in form)
 */
Showtime.models.Student = Ext.regModel('Student', {
    fields: [
        {name: 'firstname', type: 'string'},
        {name: 'lastname',  type: 'string'},
        {name: 'profileurl',type: 'string'},
        {name: 'shorturl',  type: 'string'},
    ]
});