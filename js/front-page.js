jQuery(document).ready(function($) {
	var Assignment = Backbone.Model.extend({  
		initialize: function(){  
		},  
		defaults: {  
			title: 'Default title',  
			releaseDate: 2011,  
		}  
	});  

	var AssignmentCollection = Backbone.Collection.extend({
		model: Assignment,
		url: 'wp-admin/admin-ajax.php?action=backbone&model=assignments'
	});

	var AssignmentView = Backbone.View.extend({
		tagname: 'div',
		className: 'assignment', 
		render: function() {
			$(this.el).html(this.model.get('title'));
		}
	});
	
	var assignments = new AssignmentCollection;
	var AssignmentListView = Backbone.View.extend({
		el: $('<ul id="assignments"></ul>'),
		initialize: function() {
			_.bindAll(this, 'render', 'appendAssignment', 'appendAssignments');
			assignments.bind('reset', this.appendAssignments, this);
		},
		render: function() {
			this.$el.addClass('nav nav-tabs');
			return this;
		},
		appendAssignment: function(assignment) {
			var list_item = $('<li><a href="#'+assignment.get('term_id')+'">'+assignment.get('name')+'</a></li>');
			this.$el.append(list_item);
		},
		appendAssignments: function(assignments) {
			console.log(assignments);
			assignments.each(this.appendAssignment);
			$('ll:eq(0)', this.$el).addClass('active');
		}
	});

	var TabContentView = Backbone.View.extend({
		el: $('<div class="tab-content"></div>'),
		initialize: function() {
			_.bindAll(this, 'render', 'appendTab', 'appendTabs');
			assignments.bind('reset', this.appendTabs, this);
		},
		render: function() {
			return this;
		},
		appendTab: function(assignment) {
			this.$el.append('<div class="tab-pane" id="'+assignment.get('term_id')+'">hello</div>');
		},
		appendTabs: function(assignments) {
			assignments.each(this.appendTab);
			$('.tab-pane:eq(0)', this.$el).addClass('active');
		}
	});

	var AppView = Backbone.View.extend({
		el: $('#appview'),
		initialize: function() {
			this.render();
			assignments.fetch();
		},
		render: function() {
			this.$el.addClass('tabbable tabs-left');
			assignmentList = new AssignmentListView();
			this.$el.append(assignmentList.render().el);
			tabContent = new TabContentView();
			this.$el.append(tabContent.render().el);
		}
	});

	var App = new AppView;
});
