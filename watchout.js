// start slingin' some d3 here.

d3.selectAll('.gameboard').data([4,5,6,6,7,8]).enter().append('div').style('opacity', 0).text('hello world').transition().duration(1000).style('opacity', 1);