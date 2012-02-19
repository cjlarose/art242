jQuery(document).ready(function($) {
	window.Assignment = Backbone.Model.extend({  
		initialize: function(){  
		},  
		defaults: {  
			title: 'Default title',  
			releaseDate: 2011,  
		}  
	});  

	window.AssignmentCollection = Backbone.Collection.extend({
		model: Assignment,
		url: 'http://localhost/wordpress/wp-content/themes/art242/backbone.php'
	});

	window.AssignmentView = Backbone.View.extend({
		tagname: 'div',
		className: 'assignment', 
		render: function() {
			$(this.el).html(this.model.get('title'));
		}
	});
	
	window.assignments = new AssignmentCollection;
	window.AppView = Backbone.View.extend({
		el: $('#appview'),
		initialize: function() {
			assignments.bind('all', this.render, this);
			assignments.fetch();
			console.log(assignments);
		},
		render: function() {
			$(this.el).html('hello');
		}
	});

	window.App = new AppView;
});
