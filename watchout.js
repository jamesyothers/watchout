// start slingin' some d3 here.
//initialize game dimensions and number of enemies
var gameOptions = {
  height: 450,
  width:700,
  nEnemies: 30,
  padding: 20
};

//scores and collisions for score board
var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0  
};


//create a scale for our game to reside
var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};


//generate gameboard svg 
var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height',gameOptions.height);

//update scoreboard with score
var updateScore = function(){
  return d3.select('.current span').text(gameStats.score.toString());
};

//update best score if current score is higher
var updateBestScore = function(){
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
  return d3.select('.high span').text(gameStats.bestScore.toString());
};

//player constructor
var Player = function(gameOptions) {
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = '#ff6600';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;
  this.gameOptions = gameOptions;
};

//render a player on the screen
Player.prototype.render = function(gameBoard){
  this.el = gameBoard.append('svg:path').attr('d',this.path).attr('fill', this.fill);
  this.transform({
    x: this.gameOptions.width * 0.5,
    y: this.gameOptions.height * 0.5
  });
  //enable dragging functionality
  this.setupDragging();
  return this;
};

//get X coordinate of player
Player.prototype.getX = function() {
  return this.x;
};

//set X coordinate of player
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

//add dragging functionality
Player.prototype.setupDragging = function(){
  var that = this;
  var dragMove = function(){
    return that.moveRelative(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag',dragMove);
  return this.el.call(drag);
};

//array for players
var players = [];
players.push(new Player(gameOptions).render(gameBoard));

//enemy
//enemies are <g> tags in the <svg> element
var enemyGroup = gameBoard.append('g');
//create 29 enemies, none previously present
var enemies = enemyGroup.selectAll('circle').data(d3.range(1, 30)).enter()
  .append('circle')
  //randomly put enemies on board
  //cs, cy, and r are attributes of circles in D3
  .attr('cx', function() { return Math.random() * (gameOptions.width - 50);})
  .attr('cy', function() { return Math.random() * (gameOptions.height - 50);})
  .attr('r', 10)
  .style('fill', 'red');

var timerFunc = function() {
  //transition enemies to new random location after 1 second
  enemies.transition().duration(1000).attr('cx', function() { return Math.random() * (gameOptions.width - 50);})
  .attr('cy', function() { return Math.random() * (gameOptions.height - 50);});
};

//move every 1 second
setInterval(timerFunc, 1000);

//implement collision detection
var collisionFunc = function(){
  // for each circle within enemies console log cx & cy
  enemies.each(function(){
    //access the enemies x and y coordinates
    var enemyX = d3.select(this).attr('cx');
    var enemyY = d3.select(this).attr('cy');
    //access the player's x and y coordinates
    var playerX = players[0].getX();
    var playerY = players[0].getY();
    //determine proximity of enemies to player
    if (Math.abs(playerX - enemyX) < 10 && Math.abs(playerY - enemyY) < 10) {
      //if collision reset score
      gameStats.score = 0;
      //update the score
      updateScore();
      //increase collisions for score board
      gameStats.collisions++;
      //display updated collision number
      d3.select('.collisions span').text(gameStats.collisions.toString());
    }
  });
};

//d3.timer() will run the function every time the screen updates (frame rate cycle)
//this led to multiple collision detections when only one desired to be recorded
//d3.timer(collisionFunc);
//check for collisions every 0.1 second
setInterval(collisionFunc, 100);

//update the score as the player survices
var scoreUpdater = function() {
  //increase score 100 points every second
  gameStats.score += 100;
  updateScore();
  //update best score as necessary
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
  }
  updateBestScore();
};

//update the score every 1 second
setInterval(scoreUpdater, 1000);


