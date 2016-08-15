(function() {
  var ThroughputGraph;

  ThroughputGraph = (function() {
    function ThroughputGraph() {}

    ThroughputGraph.build = function(_arg) {
      var allIssues, bandPadding, color, el, element, height, json, legend, margin, marginalizedHeight, marginalizedWidth, svg, total, width, x, xAxis, xRangeInterval, y, yAxis, yMax, yRangeInterval, _i, _len, _ref, _results;
      json = _arg.json, el = _arg.el, yMax = _arg.yMax, width = _arg.width, height = _arg.height;
      margin = {
        top: 20,
        right: 110,
        bottom: 20,
        left: 30
      };
      marginalizedWidth = width - margin.left - margin.right;
      marginalizedHeight = height - margin.top - margin.bottom;
      bandPadding = .1;
      xRangeInterval = [0, marginalizedWidth];
      yRangeInterval = [marginalizedHeight, 0];
      x = d3.scale.ordinal().rangeRoundBands(xRangeInterval, bandPadding);
      y = d3.scale.linear().range(yRangeInterval);
      color = d3.scale.ordinal().range(['#1272ba', '#77bcf7', '#c7f464']);
      color.domain(d3.keys(json[0]).filter(function(key) {
        return key !== 'week';
      }));
      total = 0;
      json.forEach(function(d) {
        var y0;
        y0 = 0;
        d.allIssueData = color.domain().map(function(issueType) {
          var issueTypeCount;
          issueTypeCount = d[issueType];
          return {
            issueType: issueType,
            y0: y0,
            y1: y0 += issueTypeCount
          };
        });
        d.total = d.allIssueData[d.allIssueData.length - 1].y1;
        if (d.total > total) {
          return total = d.total;
        }
      });
      if (yMax == null) {
        yMax = total;
      }
      xAxis = d3.svg.axis().scale(x).orient('bottom');
      yAxis = d3.svg.axis().scale(y).orient('left').tickValues([0, Math.round(yMax / 2), yMax]).tickFormat(d3.format('0f'));
      svg = d3.select(el).append('svg').attr('xmlns', 'http://www.w3.org/2000/svg').attr('width', width).attr('height', height).append('g').attr('transform', "translate(" + margin.left + "," + margin.top + ")").attr('font-family', 'Verdana,Geneva,sans-serif').attr('font-size', '10');
      x.domain(json.map(function(d) {
        return d.week;
      }));
      y.domain([0, yMax]);
      svg.append('g').attr('class', 'x axis').attr('transform', "translate(0," + marginalizedHeight + ")").call(xAxis);
      svg.append('g').attr('class', 'y axis').call(yAxis);
      allIssues = svg.selectAll('.bar').data(json).enter().append('g').attr('class', 'bar').attr('transform', function(d) {
        return "translate(" + (x(d.week)) + ",0)";
      });
      allIssues.selectAll('g').data(function(d) {
        return d.allIssueData;
      }).enter().append('rect').attr('class', 'bar').attr('width', x.rangeBand()).attr('y', function(bar) {
        return y(bar.y1);
      }).attr('height', function(bar) {
        return y(bar.y0) - y(bar.y1);
      }).style('fill', function(bar) {
        return color(bar.issueType);
      });
      allIssues.append('text').attr('y', function(d) {
        return y(d.total) - 5;
      }).attr('x', x.rangeBand() / 2).style('text-anchor', 'middle').style('font-family', 'sans-serif').text(function(d) {
        if (d.total) {
          return d.total;
        } else {
          return '';
        }
      });
      legend = svg.selectAll('.legend').data(color.domain().slice().reverse()).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
        return "translate(3," + (i * 20) + ")";
      });
      legend.append('rect').attr('x', marginalizedWidth + 85).attr('width', 18).attr('height', 18).style('fill', color);
      legend.append('text').attr('x', marginalizedWidth + 69).attr('y', 9).attr('dy', '.35em').style('text-anchor', 'end').text(function(d) {
        return d;
      });
      _ref = document.querySelectorAll('.domain');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.setAttribute('fill', 'none');
        _results.push(element.setAttribute('stroke', '#999'));
      }
      return _results;
    };

    return ThroughputGraph;

  })();

  window.WaffleMetrics || (window.WaffleMetrics = {});

  window.WaffleMetrics.ThroughputGraph = ThroughputGraph;

}).call(this);
