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
  collisions: 0  //?
};

//map axes

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};


//generate gameboard
var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height',gameOptions.height);
//console.log(gameBoard);

//update scoreboard
var updateScore = function(){
  return d3.select('.current span').text(gameStats.score.toString());
};

//update best score if current score is higher
var updateBestScore = function(){
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
  return d3.select('.high span').text(gameStats.bestScore.toString());
};
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
  return this.x = x;
};

Player.prototype.getY = function() {
  return this.y;
};

Player.prototype.setY = function(y) {
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.height - this.gameOptions.padding;
  if (y <= minY) {
    y = minY;
  }
  if (y >= maxY) {
    y = maxY;
  }
  return this.y = y;
};

Player.prototype.transform = function(opts){
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);
  return this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
};

Player.prototype.moveAbsolute = function(x,y) {
  return this.transform({
    x:x,
    y:y});
};

Player.prototype.moveRelative = function(dx,dy) {
  return this.transform({
    x: this.getX() + dx,
    y: this.getY() + dy,
    angle: 360 * (Math.atan2(dy,dx)/(Math.PI*2))
  });
};

Player.prototype.setupDragging = function(){
  var that = this;
  var dragMove = function(){
    return that.moveRelative(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag',dragMove);
  return this.el.call(drag);
};

var players = [];
players.push(new Player(gameOptions).render(gameBoard));
//players.push(new Player(gameOptions).render(gameBoard));

//enemy
//d3.selectAll('g').data([1,2,3,4,5]).enter().append('g').text('a').style('color', 'red');
var enemyGroup = gameBoard.append('g');
var enemies = enemyGroup.selectAll('circle').data(d3.range(1, 30)).enter()
  .append('circle')
  .attr('cx', function() { return Math.random() * (gameOptions.width - 50);})
  .attr('cy', function() { return Math.random() * (gameOptions.height - 50);})
  .attr('r', 10)
  .style('fill', 'red');

var timerFunc = function() {
  enemies.transition().duration(1000).attr('cx', function() { return Math.random() * (gameOptions.width - 50);})
  .attr('cy', function() { return Math.random() * (gameOptions.height - 50);});
};

//d3.timer
setInterval(timerFunc, 1000);
var counter = 0;
var collisionFunc = function(){

  // console.log(players[0].getY());
  // for each circle within enemies console log cx & cy
  enemies.each(function(){
    var enemyX = d3.select(this).attr('cx');
    var enemyY = d3.select(this).attr('cy');
    var playerX = players[0].getX();
    var playerY = players[0].getY();
    if (Math.abs(playerX - enemyX) < 10 && Math.abs(playerY - enemyY) < 10) {
      gameStats.score = 0;
      updateScore();
    }
  });



  //
  // if(this.getX() === && this.getY()) {
  //   alert('collision');
  // }
};

//collisionFunc();
setInterval(collisionFunc, 100);

var scoreUpdater = function() {
  gameStats.score += 100;
  updateScore();
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
  }
  updateBestScore();
};

setInterval(scoreUpdater, 1000);



