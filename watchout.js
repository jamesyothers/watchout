// start slingin' some d3 here.

//game options
var gameOptions = {
  height: 450,
  width:700,
  nEnemies: 30,
  padding: 20
};

//game stats
var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

//map axes

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};


//generate gameboard
var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height',gameOptions.height);
console.log(gameBoard);

//update scoreboard
d3.select('.current span').text(gameStats.score.toString());

//update best score if current score is higher
gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
d3.select('.high span').text(gameStats.bestScore.toString());

//player

  //player gets hit
    //then reset score
  //else score goes up
var Player = function(gameOptions) {
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = '#ff6600';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;
  this.gameOptions = gameOptions;
  // this.constructor = function(gameOptions){
  //   this.gameOptions = gameOptions;
  // };
};

Player.prototype.render = function(gameBoard){
  this.el = gameBoard.append('svg:path').attr('d',this.path).attr('fill', this.fill);
  this.transform({
    x: this.gameOptions.width * 0.5,
    y: this.gameOptions.height * 0.5
  });
  this.setupDragging();
  return this;
};

Player.prototype.getX = function() {
  return this.x;
};

Player.prototype.setX = function(x) {
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;
  if (x <= minX) {
    x = minX;
  }
  if (x >= maxX) {
    x = maxX;
  }
  this.x = x;
};

Player.prototype.getY = function() {
  return this.y;
};

Player.prototype.setY = function(y) {
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.width - this.gameOptions.padding;
  if (y <= minY) {
    y = minY;
  }
  if (y >= maxY) {
    y = maxY;
  }
  this.y = y;
};

Player.prototype.transform = function(opts){
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);
  return this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
};

Player.prototype.moveAbsolute = function(x,y) {
  return this.transform({x:x, y:y});
};


//enemy

var enemies = 30;
