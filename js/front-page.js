jQuery(document).ready(function($) {
	var Assignment = Backbone.Model.extend({  
		initialize: function(){  
			this.submissionCollection = new SubmissionCollection();
			this.submissionCollection.url = 'wp-admin/admin-ajax.php?action=backbone&model=photocollections&assignment_id=' + this.get('term_id');
			this.submissionCollection.bind('reset', function(submissions) {
				submissions.each(function(e, i) {
					e.photos = new PhotoCollection(e.get('photos'));
					Photos.add(e.get('photos'));
				});
				console.log(Photos);
			});
		},  
		defaults: {  
		},
		idAttribute: 'term_id'
	});  

	var AssignmentCollection = Backbone.Collection.extend({
		model: Assignment,
		url: 'wp-admin/admin-ajax.php?action=backbone&model=assignments'
	});

	var Submission = Backbone.Model.extend({
		initialize: function() {
			this.photos = new PhotoCollection();
		}
	});

	var SubmissionCollection = Backbone.Collection.extend({
		model: Submission
	});

	var Photo = Backbone.Model.extend({
		
	});

	var PhotoCollection = Backbone.Collection.extend({
		model: Photo
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
			this.$el.append("<h3>"+submission.get('title')+"<small>"+submission.get('author')+"</small></h3>");
			var thumbs = $('<ul class="thumbnails"></ul>');
			var self = this;
			_.each(submission.photos.models, function(photo, i) {
				thumbs.append('<li class="span3"><a href="#photo/'+photo.get('ID')+'" class="thumbnail">'+photo.get('span3')+'</a></li>');
			});
			//console.log(thumbs);
			this.$el.append(thumbs);
		},
		appendSubmissions: function(submissions) {
			//console.log(submissions);
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

	var Assignments = new AssignmentCollection();
	var Photos = new PhotoCollection();

	var AppRouter = Backbone.Router.extend({
		routes: {
			"": "list",
			"assignment/:id" : "assignmentDetails",
			"photo/:id" : "photoDetails"
		},
		list: function(cb) {
			this.assignments = Assignments;
			var appView = new AppView({model: this.assignments});
			if (cb == undefined) {
				cb = function() {
					App.navigate('assignment/' + Assignments.at(0).id, true);
				}
			}
			this.assignments.bind('reset', cb);
			this.assignments.fetch();
		},
		assignmentDetails: function(id) {
			action = function() {
				$('.nav-tabs li').removeClass('active');
				//console.log($('a[href="#assignment/' + id + '"]'));
				$('a[href="#assignment/' + id + '"]').parent().addClass('active');
				var assignment = Assignments.get(id);
				var tab = new TabView({model: assignment});
				$('.tab-content').append(tab.render().el);
				tab.$el.siblings().removeClass('active');
				tab.$el.addClass('active');
				if (assignment.submissionCollection.length == 0)
					assignment.submissionCollection.fetch();
			};
			if (this.assignments == undefined) {
				this.list(action);
			} else {
				action();
			}
		},
		photoDetails: function(id) {
			console.log('photo' + id);
		}
	});

	var App = new AppRouter();
	Backbone.history.start();
});
