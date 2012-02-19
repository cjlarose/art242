jQuery(document).ready(function($) {
	var Assignment = Backbone.Model.extend({  
		initialize: function(){  
			this.submissionCollection = new SubmissionCollection();
			this.submissionCollection.url = 'wp-admin/admin-ajax.php?action=backbone&model=photocollections&assignment_id=' + this.get('term_id')
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

	var Submission = Backbone.Model.extend({
	});

	var SubmissionCollection = Backbone.Collection.extend({
		model: Submission
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
			var list_item = $('<li><a data-toggle="tab" href="#'+assignment.get('term_id')+'">'+assignment.get('name')+'</a></li>');
			this.$el.append(list_item);
		},
		appendAssignments: function(assignments) {
			assignments.each(this.appendAssignment);
			$('li:eq(0)', this.$el).addClass('active');
		}
	});

	var TabView = Backbone.View.extend({
		tagName: 'div',
		className: 'tab-pane',
		initialize: function() {
			_.bindAll(this, 'render', 'appendSubmissions', 'appendSubmission');
			this.model.submissionCollection.bind('reset', this.appendSubmissions);
			this.model.submissionCollection.fetch();
		},
		render: function() {
			this.$el.attr('id', this.model.get('term_id'));
			this.$el.append('<h2>' + this.model.get('name') + '</h2>');
			return this;
		},
		appendSubmission: function(submission) {
			this.$el.append("<h3>"+submission.get('title')+"</h3>");
			this.$el.append("<cite>"+submission.get('author')+"</cite>");
			var thumbs = $('<ul class="thumbnails"></ul>');
			_.each(submission.get('attachments'), function(e, i) {
				thumbs.append("<li class=\"span3\"><a href=\"#\" class=\"thumbnail\">"+e.medium+"</a></li>");
			});
			console.log(thumbs);
			this.$el.append(thumbs);
		},
		appendSubmissions: function(submissions) {
			console.log(submissions);
			submissions.each(this.appendSubmission);
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
			var tab = new TabView({
				model: assignment
			});
			this.$el.append(tab.render().el);
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
