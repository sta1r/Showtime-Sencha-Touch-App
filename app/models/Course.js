/**
 * @class Courses
 * @extends Ext.data.Model
 * The Course model
 */
Ext.regModel("Courses", {
    fields: [
        {name: "id", type: "int"},
        {name: "name", type: "string"},
        {name: "slug", type: "string"},
        {name: "url", type: "string"},
    ],
    
    proxy: {
		type: 'scripttag',
	    url : '/showtime/lcf/ma/2011/courses.json',
	    reader: {
            type: 'json',
            root: 'data.Courses'
        }
	}
});

/*showtime.models.CourseList = Ext.regModel('showtime.models.CourseList', {
	fields: [
	   'id', 'name', 'slug', 'url'
	],
	idProperty: 'id',
    proxy: {
    	type: 'scripttag',
    	url: '/showtime/lcf/ma/2011/courses.json',
    	reader: {
    		type: 'json',
    		root: 'data.Courses'
    	}
    }		
});
*/

Ext.regStore('Courses', {
//showtime.stores.courseList = new Ext.data.Store({
    //model: 'showtime.models.CourseList',
    model: 'Courses',
    sorters: 'name',
    pageSize: 50
});