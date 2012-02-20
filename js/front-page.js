jQuery(document).ready(function($) {
	var Assignment = Backbone.Model.extend({  
		initialize: function(){  
			this.submissionCollection = new SubmissionCollection();
			this.submissionCollection.url = 'wp-admin/admin-ajax.php?action=backbone&model=photocollections&assignment_id=' + this.get('term_id')
		},  
		defaults: {  
			title: 'Default title',  
			releaseDate: 2011,  
		},
		idAttribute: 'term_id'
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
	
	var AssignmentListView = Backbone.View.extend({
		el: $('<ul id="assignments"></ul>'),
		initialize: function() {
			_.bindAll(this, 'render', 'appendAssignment', 'appendAssignments');
			this.model.bind('reset', this.appendAssignments, this);
		},
		render: function() {
			this.$el.addClass('nav nav-tabs');
			return this;
		},
		appendAssignment: function(assignment) {
			var list_item = $('<li><a href="#assignment/'+assignment.get('term_id')+'">'+assignment.get('name')+'</a></li>');
			this.$el.append(list_item);
		},
		appendAssignments: function(assignments) {
			assignments.each(this.appendAssignment);
			//$('li:eq(0)', this.$el).find('a').tab('show');
		}
	});

	var TabView = Backbone.View.extend({
		tagName: 'div',
		className: 'tab-pane',
		initialize: function() {
			_.bindAll(this, 'render', 'appendSubmissions', 'appendSubmission');
			this.model.submissionCollection.bind('reset', this.appendSubmissions);
			//target.bind('show', this.render);
			//this.model.submissionCollection.fetch();
		},
		render: function() {
			this.$el.attr('id','assignment' +  this.model.get('term_id'));
			this.$el.append('<h2>' + this.model.get('name') + '</h2>');
			this.appendSubmissions(this.model.submissionCollection);
			return this;
		},
		appendSubmission: function(submission) {
			this.$el.append("<h3>"+submission.get('title')+"</h3>");
			this.$el.append("<cite>"+submission.get('author')+"</cite>");
			var thumbs = $('<ul class="thumbnails"></ul>');
			_.each(submission.get('attachments'), function(e, i) {
				thumbs.append("<li class=\"span3\"><a href=\"#\" class=\"thumbnail\">"+e.span3+"</a></li>");
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
			_.bindAll(this, 'render', 'appendTab');
		},
		render: function() {
			return this;
		},
		appendTab: function(assignment) {
			var tab = new TabView({
				model: assignment
			});
			this.$el.append(tab.render().el);
		}
	});

	var AppView = Backbone.View.extend({
		el: $('#appview'),
		initialize: function() {
			_.bindAll(this, 'render');
			this.render();
		},
		render: function() {
			this.$el.addClass('tabbable tabs-left');
			assignmentList = new AssignmentListView({model: this.model});
			this.$el.append(assignmentList.render().el);
			tabContent = new TabContentView({model: this.model});
			this.$el.append(tabContent.render().el);
		}
	});

	var AppRouter = Backbone.Router.extend({
		routes: {
			"": "list",
			"assignment/:id" : "assignmentDetails"
		},
		list: function() {
			this.assignments = new AssignmentCollection();
			var appView = new AppView({model: this.assignments});
			this.assignments.fetch();
		},
		assignmentDetails: function(id) {
			$('.nav-tabs li').removeClass('active');
			console.log($('a[href="#assignment/' + id + '"]'));
			$('a[href="#assignment/' + id + '"]').parent().addClass('active');
			var assignment = this.assignments.get(id);
			var tab = new TabView({model: assignment});
			$('.tab-content').append(tab.render().el);
			tab.$el.siblings().removeClass('active');
			tab.$el.addClass('active');
			if (assignment.submissionCollection.length == 0)
				assignment.submissionCollection.fetch();
		}
	});

	var App = new AppRouter();
	Backbone.history.start();
});
