define(['backbone', 'underscore', 'text!templates/skills/skill-graph.html', 'libs/springy/springyui'],
	function(Backbone, _, skillGraphHtml, Springy){

	var skillGraph = Backbone.View.extend({
		el: 'body', // Not normal practice but is valid enough in this case of only having one page.

		events: {
			'click #skill-graph': 'focusCanvas',
			'click a.back-to-cv': 'focusCV'
		},

		initialize: function() {
			_.bindAll(this, 'navigateAndCreateNodes', 'createSkillFilterList');
			this.createSkillFilterList();
		},

		createSkillFilterList: function() {
			var graph = new Springy(),
				$window = $(window),
				$skillGraph,
				data = {
					label: 'John Harman',
					font: '26px Verdana, sans-serif',
					height: 26,
					children: [
						{
							label: 'Front-end', color: '#7DBE3C', children: [
								{ label: 'XHTML' },
								{ label: 'HTML5' },
								{ label: 'CSS' },
								{
									label: 'Javascript', children: [
										{ label: 'jQuery' },
										{ label: 'jQueryUI' },
										{ label: 'Backbone' },
										{ label: 'Underscore' },
										{ label: 'AMD' }
									]
								}
							]
						},
						{
							label: 'Back-end', color: '#00A0B0', children: [
								{
									label: '.NET', children: [
										{ label: '2.0 - 4.0' },
										{ label: 'NHibernate' },
										{ label: 'MVC 2 - 3' },
										{ label: 'Lucene.NET' },
										{ label: 'protobuf-net' }
									]
								},
								{
									label: 'Database', children: [
										{ label: 'SQL Server 2000'},
										{ label: 'SQL Server 2005'},
										{ label: 'SQL Server 2008'},
										{ label: 'MySQL'}
									]
								}
							]
						},
						{
							label: 'Software', color: '#CC333F', children: [
								{ label: 'Windows' },
								{ label: 'Mac OSX' },
								{ label: 'Visual Studio' },
								{ label: 'Sublime Text 2' },
								{ label: 'Photoshop' },
								{ label: 'SVN' },
								{ label: 'Git' },
								{ label: 'Node.js' }
							]
						},
						{
							label: 'Characteristics', color: '#5A308D', children: [
								{ label: 'Good communicator' },
								{ label: 'Creative thinker' },
								{ label: 'Problem solver' },
								{ label: 'Patient' },
								{ label: 'Hard worker' },
								{ label: 'Quick learner' },
								{ label: 'Responsible' },
								{ label: 'Adaptable' }
							]
						}
					]
				};

			this.navigateAndCreateNodes(data, null, null, graph);

			this.$el.append(skillGraphHtml);
			$skillGraph = $('#skill-graph canvas')
				.prop({ width: $window.width(), height: $window.height() });

			$window.resize(_.throttle(function(e) {
				$skillGraph.prop({ width: $window.width(), height: $window.height() });
			}, 500));

			var springy = $skillGraph.springy({
				graph: graph
			});
		},

		navigateAndCreateNodes: function( nodeData, currentColor, parentNode, graph ) {
			var node = graph.newNode(nodeData),
				vw = this;

			var linkColour = nodeData.color ? nodeData.color : currentColor;

			if ( parentNode ) {
				graph.newEdge( parentNode, node, { color: linkColour } );
			}

			_.each(nodeData.children, function(childNode) {
				vw.navigateAndCreateNodes(childNode, linkColour, node, graph);
			});
		},

		focusCanvas: function() {
			this.$el.addClass('skill-graph-focus');
		},

		focusCV: function( e ) {
			e.preventDefault();
			e.stopPropagation();
			this.$el.toggleClass('skill-graph-focus');
		}

	});

	return skillGraph;
});