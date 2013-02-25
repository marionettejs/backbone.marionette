/*global $:false, _:false, Morris:false, __report:false, __options: false, Raphael:false */
/*jshint browser:true*/

$(function(){
  "use strict";

  // Workaround for jshint complaint I don't want to turn off.
  var raphael = Raphael;

  //  $('.plato-file-link').fitText(1.2, { minFontSize: '20px', maxFontSize: '28px' });

  var colors = [
    '#01939A',
    '#FFAB00',
    '#FF0700'
  ];

  var graphHeight = 10,
    lineHeight = 1.35;

  var horizontalGraph = function(paper, num, orig, width, label, color){
    var offset = 70;
    var y = parseInt(graphHeight * num * lineHeight,10);
    paper.rect(offset, y, width, graphHeight).attr({fill: color, stroke:'none'});
    paper.text(offset - 5, y + 5, label).attr({'font-size':12,'text-anchor':'end' });
    paper.text(width + offset + 8, y + 6, orig).attr({'font-size':10,'text-anchor':'start' });
  };

  function getColor(value, colors, thresholds) {
    thresholds = thresholds || [];
    for (var i = thresholds.length - 1; i > -1; i--) {
      if (value > thresholds[i]) return colors[i+1];
    }
    return colors[0];
  }

  function drawFileCharts(reports) {
    reports.forEach(function(report, i){
      var $container = $('#plato-file-' + i + ' .plato-file-chart');
      var width = $container.width(),
          height = $container.height();

      var chart = $container.data('chart');
      if (!chart) $container.data('chart', chart = raphael($container[0],width,height));
      chart.clear();
      chart.setSize(width, height);

      // yield for UI
      setTimeout(function(){
        //leave room at the end for the value labels.
        width = width - 120;

        var value = report.complexity.aggregate.complexity.cyclomatic;
        horizontalGraph(chart,0,value, Math.min(value * 2, width),'complexity', getColor(value, colors, [5,10]));

        value = report.complexity.aggregate.complexity.sloc.physical;
        horizontalGraph(chart,1,value, Math.min(value, width), 'sloc', getColor(value,colors,[400,600]));

        value = report.complexity.aggregate.complexity.halstead.bugs.toFixed(2);
        horizontalGraph(chart,2,value, value * 5, 'est bugs', getColor(value,colors,[1,5]));

        value = report.jshint.messages;
        horizontalGraph(chart,3,value, value * 5, 'lint errors', getColor(value,colors,[1,10]));
      },0);
    });
  }

  function drawOverviewCharts(reports) {
    $('.chart').empty();

    var maintainability = {
      element: 'chart_maintainability',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      ymax : 100,
      ymin : 0,
      labels: ['Maintainability'],
      barColors : ['#ff9b40']
    };
    var sloc = {
      element: 'chart_sloc',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      ymax : 400,
      labels: ['Lines'],
      barColors : ['#1f6b75']
    };
    var bugs = {
      element: 'chart_bugs',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      labels: ['Bugs'],
      ymax: 20,
      barColors : ['#ff9b40']
    };
    var lint = {
      element: 'chart_lint',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      labels: ['Errors'],
      ymax: 20,
      barColors : ['#1f6b75']
    };

    reports.forEach(function(report){

      sloc.ymax = Math.max(sloc.ymax, report.complexity.aggregate.complexity.sloc.physical);
      bugs.ymax = Math.max(bugs.ymax, report.complexity.aggregate.complexity.halstead.bugs.toFixed(2));


      sloc.data.push({
        value : report.complexity.aggregate.complexity.sloc.physical,
        label : report.info.fileShort
      });
      bugs.data.push({
        value : report.complexity.aggregate.complexity.halstead.bugs.toFixed(2),
        label : report.info.fileShort
      });
      maintainability.data.push({
        value : report.complexity.maintainability ? report.complexity.maintainability.toFixed(2) : 0,
        label : report.info.fileShort
      });
      lint.data.push({
        value : report.jshint && report.jshint.messages,
        label : report.info.fileShort
      });
    });

    function onGraphClick(i){
      document.location = __report.reports[i].info.link;
    }

    var charts = [
      Morris.Bar(bugs),
      Morris.Bar(sloc),
      Morris.Bar(maintainability)
    ];

    if (__options.flags.jshint) charts.push(Morris.Bar(lint));

    charts.forEach(function(chart){
      chart.on('click', onGraphClick);
    });
    return charts;
  }

  drawOverviewCharts(__report.reports);
  drawFileCharts(__report.reports);

  $(window).on('resize', _.debounce(function(){
    drawFileCharts(__report.reports);
    drawOverviewCharts(__report.reports);
  },200));
});



