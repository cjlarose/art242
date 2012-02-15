jQuery(document).ready(function($) {
	var Assignment = Backbone.Model.extend({  
		initialize: function(){  
		},  
		defaults: {  
			name: 'Default title',  
			releaseDate: 2011,  
		}  
	});  

	var AssignmentCollection = Backbone.Collection.extend({
		model: Assignment,
		url: '/assignments'
	});

	assignments = new AssignmentCollection;
	assignments.fetch();
//	$('body').css('backgroundColor', '#f60');
});
