showtime.models.CourseList = Ext.regModel('showtime.models.CourseList', {
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

showtime.stores.courseList = new Ext.data.Store({
    model: 'showtime.models.CourseList',
    sorters: 'name',
    pageSize: 50
});