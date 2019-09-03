//////////////////////////////////
////////              ////////////
////////  VARIABLES   ////////////
////////              ////////////
//////////////////////////////////

// Canvas vars
var width = 900,
  height = 600,
  c = document.getElementById('c'),
  ctx = c.getContext('2d');

c.width = width;
c.height = height;

// Scene position and size
var sceneX = 60,
  sceneY = 60,
  sceneWidth = 420,
  sceneHeight = 420,
  sceneEndX = sceneX + sceneWidth,
  sceneEndY = sceneY + sceneHeight;

// Tile side length
var tileSize = 30;

// Performance vars
var frameCount = 0,
  FPS = 0;

// Cursor-related vars
var cursorX = 0,
  cursorY = 0,
  cursorImg = null;

// Inventory vars
var inventory = [],
  selectedInv;

// The enemies currently in the scene
var enemies = [];

// Contains the objects built into the scene by the player
var sceneObj = [],
  selectedObj = null; // Points to the selected scene object

// The projectiles shot by the scene objects
var projectiles = [];

// Images
var sceneImg = new Image(),
  beetle1_l_img = new Image(),
  beetle1_r_img = new Image(),
  beetle1_u_img = new Image(),
  beetle1_d_img = new Image(),
  beetle2_l_img = new Image(),
  beetle2_r_img = new Image(),
  beetle2_u_img = new Image(),
  beetle2_d_img = new Image(),
  beetle3_l_img = new Image(),
  beetle3_r_img = new Image(),
  beetle3_u_img = new Image(),
  beetle3_d_img = new Image(),
  beetle4_l_img = new Image(),
  beetle4_r_img = new Image(),
  beetle4_u_img = new Image(),
  beetle4_d_img = new Image(),
  beetle5_l_img = new Image(),
  beetle5_r_img = new Image(),
  beetle5_u_img = new Image(),
  beetle5_d_img = new Image(),
  wallImg = new Image(),
  sprayImg = new Image(),
  mushrImg = new Image(),
  antImg = new Image(),
  sprayEffectImg = new Image(),
  mushrEffectImg = new Image(),
  antEffectImg = new Image();

// Gameplay-related vars
var _money = 300,
  _scores = 0,
  _enemiesPassed = 0,
  _buildAllowed = true,
  _currentWave = 0,
  _timeToNextWave = 0,
  _gameRunning = false;

// Waves
var wave1 = [10, 0, 0, 0, 0],
  wave2 = [5, 5, 0, 0, 0],
  wave3 = [0, 10, 0, 0, 0],
  wave4 = [5, 5, 5, 0, 0],
  wave5 = [0, 10, 5, 0, 0],
  wave6 = [0, 5, 10, 0, 0],
  wave7 = [0, 0, 5, 5, 0],
  wave8 = [0, 0, 10, 5, 0],
  wave9 = [0, 0, 0, 5, 5],
  wave10 = [0, 0, 0, 10, 5];

var waves = [];
waves.push(wave1);
waves.push(wave2);
waves.push(wave3);
waves.push(wave4);
waves.push(wave5);
waves.push(wave6);
waves.push(wave7);
waves.push(wave8);
waves.push(wave9);
waves.push(wave10);

// Spawn and wave timers
var spawnTimer, waveTimer;

////////////////////////////////
////////            ////////////
////////  OBJECTS   ////////////
////////            ////////////
////////////////////////////////

//
// Base definition of a game object
//
function gameObject() {
  this.x = 0;
  this.y = 0;
  this.image = null;
}

//
// Extend gameObject for invObject
//
function invObject() {
  this.name = '';
  this.projectileImg = null;
  this.damageOutput = [];
  this.attackRadius = [];
  this.attackRate = [];
  this.cost = [];
}
invObject.prototype = new gameObject();

//
// Extend gameObject for enemyObject
//
function enemyObject() {
  this.speed = 0;
  this.startHealth = 0;
  this.health = 0;
  this.wp = [];
  this.imagel = null;
  this.imager = null;
  this.imageu = null;
  this.imaged = null;
  this.isDestroyed = false;
}
enemyObject.prototype = new gameObject();

//
// Extend enemyObject for lvl1 beetle
//
function beetle_lvl1() {}
beetle_lvl1.prototype = new enemyObject();
beetle_lvl1.prototype.speed = 0.5;
beetle_lvl1.prototype.startHealth = 100;
beetle_lvl1.prototype.health = beetle_lvl1.prototype.startHealth;
beetle_lvl1.prototype.imagel = beetle1_l_img;
beetle_lvl1.prototype.imager = beetle1_r_img;
beetle_lvl1.prototype.imageu = beetle1_u_img;
beetle_lvl1.prototype.imaged = beetle1_d_img;

//
// Extend enemyObject for lvl2 beetle
//
function beetle_lvl2() {}
beetle_lvl2.prototype = new enemyObject();
beetle_lvl2.prototype.speed = 0.75;
beetle_lvl2.prototype.startHealth = 150;
beetle_lvl2.prototype.health = beetle_lvl2.prototype.startHealth;
beetle_lvl2.prototype.imagel = beetle2_l_img;
beetle_lvl2.prototype.imager = beetle2_r_img;
beetle_lvl2.prototype.imageu = beetle2_u_img;
beetle_lvl2.prototype.imaged = beetle2_d_img;

//
// Extend enemyObject for lvl3 beetle
//
function beetle_lvl3() {}
beetle_lvl3.prototype = new enemyObject();
beetle_lvl3.prototype.speed = 1.0;
beetle_lvl3.prototype.startHealth = 200;
beetle_lvl3.prototype.health = beetle_lvl3.prototype.startHealth;
beetle_lvl3.prototype.imagel = beetle3_l_img;
beetle_lvl3.prototype.imager = beetle3_r_img;
beetle_lvl3.prototype.imageu = beetle3_u_img;
beetle_lvl3.prototype.imaged = beetle3_d_img;

//
// Extend enemyObject for lvl4 beetle
//
function beetle_lvl4() {}
beetle_lvl4.prototype = new enemyObject();
beetle_lvl4.prototype.speed = 1.25;
beetle_lvl4.prototype.startHealth = 250;
beetle_lvl4.prototype.health = beetle_lvl4.prototype.startHealth;
beetle_lvl4.prototype.imagel = beetle4_l_img;
beetle_lvl4.prototype.imager = beetle4_r_img;
beetle_lvl4.prototype.imageu = beetle4_u_img;
beetle_lvl4.prototype.imaged = beetle4_d_img;

//
// Extend enemyObject for lvl5 beetle
//
function beetle_lvl5() {}
beetle_lvl5.prototype = new enemyObject();
beetle_lvl5.prototype.speed = 1.5;
beetle_lvl5.prototype.startHealth = 300;
beetle_lvl5.prototype.health = beetle_lvl5.prototype.startHealth;
beetle_lvl5.prototype.imagel = beetle5_l_img;
beetle_lvl5.prototype.imager = beetle5_r_img;
beetle_lvl5.prototype.imageu = beetle5_u_img;
beetle_lvl5.prototype.imaged = beetle5_d_img;

//
// Inventory Objects
//
var wall = new invObject();
wall.name = 'Wall';
wall.image = wallImg;
wall.x = 575;
wall.y = 135;
wall.cost = [10];
wall.damageOutput = [0];
wall.attackRadius = [0];
wall.attackRate = [0];
wall.maxLevel = 0;

var spray = new invObject();
spray.name = 'Insect repellent';
spray.image = sprayImg;
spray.x = 630;
spray.y = 135;
spray.cost = [20, 30, 40, 50, 60];
spray.damageOutput = [20, 40, 60, 80, 100];
spray.attackRadius = [40, 60, 80, 100, 120];
spray.attackRate = [10, 20, 30, 60, 80];
spray.projectileImg = sprayEffectImg;
spray.maxLevel = 5;

var mushr = new invObject();
mushr.name = 'Infectious mushroom';
mushr.image = mushrImg;
mushr.x = 683;
mushr.y = 135;
mushr.cost = [40, 45, 50, 55, 60];
mushr.damageOutput = [70, 85, 100, 115, 130];
mushr.attackRadius = [100, 100, 100, 100, 100];
mushr.attackRate = [2, 4, 8, 16, 32];
mushr.projectileImg = mushrEffectImg;
mushr.maxLevel = 5;

var ant = new invObject();
ant.name = 'Formicidae';
ant.image = antImg;
ant.x = 738;
ant.y = 135;
ant.cost = [100, 120, 140];
ant.damageOutput = [100, 150, 200];
ant.attackRadius = [50, 50, 50];
ant.attackRate = [1, 2, 4];
ant.projectileImg = antEffectImg;
ant.maxLevel = 3;

inventory.push(wall);
inventory.push(spray);
inventory.push(mushr);
inventory.push(ant);

//
// Extend invObject for a scene object
//
function sceneObject() {
  this.level = 0;
  this.canAttackIn = 0;
  this.k = -1;
  this.l = -1;
}
sceneObject.prototype = new invObject();

//
// Extend gameObject for a projectile
//
function projectileObj() {
  this.coords = null;
}
projectileObj.prototype = new gameObject();

//////////////////////////////////
////////              ////////////
////////  FUNCTIONS   ////////////
////////              ////////////
//////////////////////////////////

//
// Starts the game
//
function startGame() {
  if (!_gameRunning) {
    _gameRunning = true;
    _currentWave = 1;
    sendWave(_currentWave);
  }
}

//
// Sends the given "wave" of enemies
//
function sendWave(waveNo) {
  var wave = waves[waveNo - 1];
  var spawns = [];

  for (var i = 0; i < wave.length; i++) {
    for (var j = 0; j < wave[i]; j++) {
      spawns.push(i + 1);
    }
  }

  var delay = 1000;
  spawnTimer = setInterval(doSpawn, delay);
  var counter = 0;

  function doSpawn() {
    spawnEnemy(spawns[counter]);

    counter++;

    if (counter == spawns.length) {
      clearInterval(spawnTimer);
    }
  }

  if (waveNo < waves.length) {
    startWaveTimer();
  }
}

//
// Stops the spawn timer
//
function stopSpawnTimer() {
  clearInterval(spawnTimer);
}

//
// Starts the wave timer
//
function startWaveTimer() {
  _timeToNextWave = 40;
  waveTimer = setInterval(countDown, 1000);

  function countDown() {
    _timeToNextWave -= 1;

    if (_timeToNextWave == 0) {
      clearInterval(waveTimer);
      _currentWave += 1;
      sendWave(_currentWave);
    }
  }
}

//
// Stops the wave timer
//
function stopWaveTimer() {
  clearInterval(waveTimer);
}

//
// Draws the wave timer
//
function drawWaveTimer() {
  if (_timeToNextWave > 0) {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.font = '22px sans-serif';
    ctx.fillText('Next wave in: ' + _timeToNextWave, 180, 550);
    ctx.closePath();
    ctx.fill();
  }
}

//
// Loads all used image files
//
function loadImages() {
  sceneImg.src = 'img/background.png';

  beetle1_l_img.src = 'img/beetle1_l.png';
  beetle1_r_img.src = 'img/beetle1_r.png';
  beetle1_u_img.src = 'img/beetle1_u.png';
  beetle1_d_img.src = 'img/beetle1_d.png';

  beetle2_l_img.src = 'img/beetle2_l.png';
  beetle2_r_img.src = 'img/beetle2_r.png';
  beetle2_u_img.src = 'img/beetle2_u.png';
  beetle2_d_img.src = 'img/beetle2_d.png';

  beetle3_l_img.src = 'img/beetle3_l.png';
  beetle3_r_img.src = 'img/beetle3_r.png';
  beetle3_u_img.src = 'img/beetle3_u.png';
  beetle3_d_img.src = 'img/beetle3_d.png';

  beetle4_l_img.src = 'img/beetle4_l.png';
  beetle4_r_img.src = 'img/beetle4_r.png';
  beetle4_u_img.src = 'img/beetle4_u.png';
  beetle4_d_img.src = 'img/beetle4_d.png';

  beetle5_l_img.src = 'img/beetle5_l.png';
  beetle5_r_img.src = 'img/beetle5_r.png';
  beetle5_u_img.src = 'img/beetle5_u.png';
  beetle5_d_img.src = 'img/beetle5_d.png';

  wallImg.src = 'img/wall.png';
  sprayImg.src = 'img/spray.png';
  mushrImg.src = 'img/mushr.png';
  antImg.src = 'img/ant.png';

  mushrEffectImg.src = 'img/mushr_effect.png';
  sprayEffectImg.src = 'img/spray_effect.png';
  antEffectImg.src = 'img/ant_effect.png';
}

//
// Spawns an enemy of the given type
//
function spawnEnemy(enemyType) {
  var e;

  if (enemyType == 1) {
    e = new beetle_lvl1();
  } else if (enemyType == 2) {
    e = new beetle_lvl2();
  } else if (enemyType == 3) {
    e = new beetle_lvl3();
  } else if (enemyType == 4) {
    e = new beetle_lvl4();
  } else if (enemyType == 5) {
    e = new beetle_lvl5();
  } else {
    return;
  }

  e.x = 30;
  e.y = 270;
  e.wp = findPath(e.x, e.y, 480, 270);
  enemies.push(e);
}

findPath(30, 270, 480, 270);

//
// Moves the enemies in the scene
// (called from gameLoop)
function moveEnemies() {
  for (var i = enemies.length - 1; i >= 0; i--) {
    var e = enemies[i];
    var hadWaypointsLeft = false;

    for (var j = 0; j < e.wp.length; j++) {
      var nextWp = enemies[i].wp[j];

      if (nextWp[0] != 0 || nextWp[1] != 0) {
        // Horizontal negative
        if (nextWp[0] < 0) {
          enemies[i].x -= enemies[i].speed;
          enemies[i].wp[j][0] += enemies[i].speed;
          enemies[i].image = enemies[i].imagel;
        }

        // Horizontal positive
        if (nextWp[0] > 0) {
          enemies[i].x += enemies[i].speed;
          enemies[i].wp[j][0] -= enemies[i].speed;
          enemies[i].image = enemies[i].imager;
        }

        // Vertical negative
        if (nextWp[1] < 0) {
          enemies[i].y -= enemies[i].speed;
          enemies[i].wp[j][1] += enemies[i].speed;
          enemies[i].image = enemies[i].imageu;
        }

        // Vertical positive
        if (nextWp[1] > 0) {
          enemies[i].y += enemies[i].speed;
          enemies[i].wp[j][1] -= enemies[i].speed;
          enemies[i].image = enemies[i].imaged;
        }

        hadWaypointsLeft = true;
        break;
      }
    }

    if (hadWaypointsLeft == false) {
      _enemiesPassed++;
      enemies.splice(i, 1);

      if (checkForGameEnd()) {
        break;
      }
    }
  }
}

function checkForGameEnd() {
  var coffeeLeft = 100 - 10 * _enemiesPassed;

  if (coffeeLeft == 0) {
    alert('Game over: All coffee is lost.');
    initGame();
    return true;
  } else if (_currentWave == waves.length && enemies.length == 0) {
    alert('Thanks to you, the world and the coffee is saved.');
    initGame();
    return true;
  }

  return false;
}

//
// This function listens the cursor movements on the canvas
//
c.onmousemove = function(e) {
  var loc = windowToCanvas(c, e.clientX, e.clientY);

  cursorX = loc.x;
  cursorY = loc.y;

  // If the cursor is moving on the scene
  if (
    cursorX >= sceneX &&
    cursorX <= sceneEndX &&
    cursorY >= sceneY &&
    cursorY <= sceneEndY
  ) {
    // And, if an inventory object is selected
    if (selectedInv != null) {
      // Set cursorImg to the same image
      // as the selected inventory item
      cursorImg = new gameObject();
      cursorImg.image = selectedInv.image;

      // Snap cursorImg to grid on both axis
      cursorImg.x = snapToGridX(cursorX);
      cursorImg.y = snapToGridY(cursorY);

      // Translate cursor coordinates
      // to indexes in sceneObj
      var i = (cursorImg.x - sceneX) / tileSize,
        j = (cursorImg.y - sceneY) / tileSize;

      // If the 'slot' is 'free'
      if (sceneObj[i][j] == null) {
        _buildAllowed = true;
      } else {
        _buildAllowed = false;
      }
    }

    // Otherwise, unset the cursor image
  } else {
    cursorImg = null;
  }
};

//
// This function listens to the mouse click events
//
c.addEventListener('click', handleClick, false);
function handleClick() {
  // If an inventory object was clicked
  for (var i = 0; i < inventory.length; i++) {
    var invEndX = inventory[i].x + inventory[i].image.width;
    var invEndY = inventory[i].y + inventory[i].image.height;

    if (
      cursorX >= inventory[i].x &&
      cursorX <= invEndX &&
      cursorY >= inventory[i].y &&
      cursorY <= invEndY
    ) {
      selectedInv = inventory[i];
      selectedObj = null;
    }
  }

  // If the scene was clicked
  if (
    cursorX >= sceneX &&
    cursorX <= sceneEndX &&
    cursorY >= sceneY &&
    cursorY <= sceneEndY
  ) {
    sceneClicked();
  }

  // If the start button was clicked
  if (cursorX >= 620 && cursorX <= 740 && cursorY >= 517 && cursorY <= 567) {
    startGame();
  }

  // If the sell button was clicked
  if (cursorX >= 565 && cursorX <= 685 && cursorY >= 320 && cursorY <= 360) {
    sellClicked();
  }

  // If the upgrade button was clicked
  if (cursorX >= 705 && cursorX <= 825 && cursorY >= 320 && cursorY <= 360) {
    upgradeClicked();
  }
}

function sellClicked() {
  if (selectedObj != null) {
    sceneObj[selectedObj.k][selectedObj.l] = null;
    _money += selectedObj.cost[selectedObj.level];
  }

  selectedObj = null;
}

function upgradeClicked() {
  if (selectedObj != null) {
    // Is upgradeable?
    if (selectedObj.level < selectedObj.maxLevel) {
      // Sufficient funds?
      if (_money >= selectedObj.cost[selectedObj.level + 1]) {
        selectedObj.level += 1;
        _money -= selectedObj.cost[selectedObj.level];
      }
    }
  }
}

function sceneClicked() {
  // Translate cursor coordinates
  // to indexes in sceneObj
  var k = (snapToGridX(cursorX) - sceneX) / tileSize,
    l = (snapToGridY(cursorY) - sceneY) / tileSize;

  // Is the clicked tile free?
  if (sceneObj[k][l] == null) {
    // Set selected object to none
    selectedObj = null;

    // Is an inventory item selected?
    if (selectedInv == null) {
      return;
    }

    // Sufficient funds to build?
    if (_money < selectedInv.cost[0]) {
      return;
    }

    // Create a new sceneobject
    // and set its properties
    var obj = new sceneObject();
    obj.x = cursorImg.x;
    obj.y = cursorImg.y;
    obj.k = k;
    obj.l = l;
    obj.level = 0;
    obj.maxLevel = selectedInv.maxLevel;
    obj.name = selectedInv.name;
    obj.image = selectedInv.image;
    obj.cost = selectedInv.cost;
    obj.attackRadius = selectedInv.attackRadius;
    obj.attackRate = selectedInv.attackRate;
    obj.damageOutput = selectedInv.damageOutput;
    obj.projectileImg = selectedInv.projectileImg;

    // Put obj to the sceneObj array
    sceneObj[k][l] = obj;

    // Does updateEnemyPaths or findPath from start to finish fail?
    if (updateEnemyPaths() == false || findPath(30, 270, 480, 270) == null) {
      // Set tile back to null,
      // unallow building and
      //return.
      sceneObj[k][l] = null;
      _buildAllowed = false;
      return;
    }

    // Decrease money
    _money -= obj.cost[obj.level];

    // Forbid building to the same spot
    _buildAllowed = false;
  } else {
    selectedObj = sceneObj[k][l];
  }
}

//
// Snaps the given X-coordinate to
// a grid on the scene.
function snapToGridX(coord) {
  coord -= sceneX;

  for (var i = 1; i <= sceneWidth / tileSize; i++) {
    if (i * tileSize > coord) {
      coord = (i - 1) * tileSize;
      break;
    }
  }

  if (coord <= sceneX) {
    ret = sceneX;
  }
  if (coord >= sceneX - tileSize) {
    ret = sceneX - tileSize;
  }

  coord += sceneX;
  return coord;
}

//
// Snaps the given Y-coordinate to
// a grid on the scene.
function snapToGridY(coord) {
  coord -= sceneY;

  for (var i = 1; i <= sceneHeight / tileSize; i++) {
    if (i * tileSize > coord) {
      coord = (i - 1) * tileSize;
      break;
    }
  }

  if (coord <= sceneY) {
    ret = sceneY;
  }
  if (coord >= sceneY - tileSize) {
    ret = sceneY - tileSize;
  }

  coord += sceneY;
  return coord;
}

function log(msg) {
  setTimeout(function() {
    throw new Error(msg);
    asd;
  }, 0);
}

//
// Translates the browser window's
// coordinates to coordinates of the canvas.
function windowToCanvas(canvas, x, y) {
  var bbox = canvas.getBoundingClientRect();

  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height),
  };
}

function clear() {
  ctx.fillStyle = '#ffffff';
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.closePath();
  ctx.fill();
}

function drawScene() {
  ctx.drawImage(sceneImg, 0, 0);
}

// Draws all objects in
// sceneObj[][] on the screen
function drawSceneObjects() {
  for (var i = 0; i < sceneWidth / tileSize; i++) {
    for (var j = 0; j < sceneHeight / tileSize; j++) {
      if (sceneObj[i] != null && sceneObj[i][j] != null) {
        ctx.drawImage(sceneObj[i][j].image, sceneObj[i][j].x, sceneObj[i][j].y);
      }
    }
  }

  if (selectedObj != null) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.rect(selectedObj.x, selectedObj.y, 30, 30);
    ctx.fill();
    ctx.closePath();
  }
}

function calcDistance(x, y, x2, y2) {
  var x_dist = 0,
    y_dist = 0;

  if (x2 > x) {
    x_dist = x2 - x;
  } else {
    x_dist = x - x2;
  }

  if (y2 > y) {
    y_dist = y2 - y;
  } else {
    y_dist = y - y2;
  }

  return Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist, 2));
}

function objects_checkForEnemies() {
  for (var i = 0; i < sceneWidth / tileSize; i++) {
    for (var j = 0; j < sceneHeight / tileSize; j++) {
      if (sceneObj[i] != null && sceneObj[i][j] != null) {
        var obj = sceneObj[i][j];
        var attackRadius = obj.attackRadius[obj.level];
        var damageOutput = obj.damageOutput[obj.level];

        if (attackRadius > 0 && damageOutput > 0) {
          if (obj.canAttackIn > 0) {
            obj.canAttackIn -= 1;
          } else {
            var target = null;
            var closestD = 99999;

            for (var k = 0; k < enemies.length; k++) {
              var enemyX = enemies[k].x + tileSize / 2;
              var enemyY = enemies[k].y + tileSize / 2;

              var objX = obj.x + tileSize / 2;
              var objY = obj.y + tileSize / 2;

              var dist = calcDistance(enemyX, enemyY, objX, objY);

              if (dist < closestD && dist <= attackRadius) {
                target = enemies[k];
                closestD = dist;
              }
            }

            //
            if (target != null) {
              doAttack(obj, target);
              obj.canAttackIn = 1000 / obj.attackRate[obj.level];
            }
          }
        }
      }
    }
  }
}

function doAttack(attacker, target) {
  // Reduce the target's health
  // (should really be done _when_ the
  // projectile reaches it's destination
  if (target.health >= attacker.damageOutput[attacker.level]) {
    target.health -= attacker.damageOutput[attacker.level];
  } else {
    target.health = 0;
  }

  // If the target's health has reached
  // zero, mark it as destroyed
  if (target.health == 0) {
    _money += 5;
    _scores += 10;
    target.isDestroyed = true;
  }

  // Get attacker's and target's center coordinates
  var x_attacker = attacker.x + tileSize / 2;
  var y_attacker = attacker.y + tileSize / 2;
  var x_target = target.x + tileSize / 2;
  var y_target = target.y + tileSize / 2;

  // Calculate the x and y deltas
  var x_delta = x_target - x_attacker;
  var y_delta = y_target - y_attacker;

  // Get the length of the vector
  var length = Math.sqrt(x_delta * x_delta + y_delta * y_delta);

  // Calculate x and y deltas for the unit vector
  var x_unit = x_delta / length;
  var y_unit = y_delta / length;

  // Create a new projectile
  // object and set its image
  var prj = new projectileObj();
  prj.image = attacker.projectileImg;

  // These are used to offset the
  // projectile's coordinates
  // so that it appears to come
  // from the center of the tile
  x_offset = prj.image.width / 2;
  y_offset = prj.image.height / 2;

  // The projectile's starting coordinates
  var x_proj = x_attacker;
  var y_proj = y_attacker;

  var coords = [];

  while (true) {
    x_proj += x_unit;
    y_proj += y_unit;

    coords.push([x_proj - x_offset, y_proj - y_offset]);

    var deltax;
    var deltay;

    if (x_target > x_proj) {
      deltax = x_target - x_proj;
    } else {
      deltax = x_proj - x_target;
    }

    if (y_target > y_proj) {
      deltay = y_target - y_proj;
    } else {
      deltay = y_proj - y_target;
    }

    if (deltax <= 6 && deltay <= 6) {
      break;
    }
  }

  // Finally, set the coordinates for the
  // projectile and put it in projectiles-array
  prj.coords = coords;
  projectiles.push(prj);
}

function moveProjectiles() {
  var start = projectiles.length - 1;

  for (var i = start; i >= 0; i--) {
    var p = projectiles[i];

    if (p.coords.length > 0) {
      p.x = p.coords[0][0];
      p.y = p.coords[0][1];

      p.coords.splice(0, 1);
    } else {
      projectiles.splice(i, 1);
    }
  }
}

function drawProjectiles() {
  for (var i = 0; i < projectiles.length; i++) {
    ctx.drawImage(projectiles[i].image, projectiles[i].x, projectiles[i].y);
  }
}

function drawEnemies() {
  var start = enemies.length - 1;
  for (var i = start; i >= 0; i--) {
    if (enemies[i].isDestroyed == false) {
      var healthBarWidth = 20;
      var healthBarHeight = 3;
      var healthBarX = enemies[i].x + 5;
      var healthBarY = enemies[i].y - 2;

      var healthLeft = Math.floor(
        (enemies[i].health / enemies[i].startHealth) * healthBarWidth,
      );
      ctx.beginPath();
      ctx.fillStyle = '#22dd22';
      ctx.rect(healthBarX, healthBarY, healthLeft, healthBarHeight);
      ctx.fill();
      ctx.closePath();

      healthBarX += healthLeft;
      healthBarWidth -= healthLeft;

      ctx.beginPath();
      ctx.fillStyle = '#dd2222';
      ctx.rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
      ctx.drawImage(enemies[i].image, enemies[i].x, enemies[i].y);
      ctx.fill();
      ctx.closePath();
    } else {
      enemies.splice(i, 1);
      checkForGameEnd();
    }
  }
}

function drawInventory() {
  for (var i = 0; i < inventory.length; i++) {
    ctx.drawImage(inventory[i].image, inventory[i].x, inventory[i].y);
  }

  if (selectedInv != null && selectedObj == null) {
    ctx.fillStyle = '#FFDCA8';
    ctx.beginPath();
    ctx.font = '14px sans-serif';
    ctx.fillText('Selected item: ' + selectedInv.name, 550, 220);
    ctx.fillText('Level', 550, 250);
    ctx.fillText('Cost', 605, 250);
    ctx.fillText('Damage', 645, 250);
    ctx.fillText('Radius', 710, 250);
    ctx.fillText('Attack rate', 760, 250);

    var y = 270;
    for (var j = 0; j < selectedInv.cost.length; j++) {
      ctx.fillText(j + 1, 563, y);
      ctx.fillText(selectedInv.cost[j], 612, y);
      ctx.fillText(selectedInv.damageOutput[j], 660, y);
      ctx.fillText(selectedInv.attackRadius[j], 720, y);
      ctx.fillText(selectedInv.attackRate[j], 783, y);
      y += 20;
    }

    ctx.closePath();
    ctx.fill();
  } else if (selectedObj != null) {
    ctx.fillStyle = '#FFDCA8';
    ctx.beginPath();
    ctx.font = '14px sans-serif';
    ctx.fillText(
      'Selected object: ' +
        selectedObj.name +
        ' (Level ' +
        (selectedObj.level + 1) +
        ')',
      550,
      220,
    );
    ctx.fillText(
      'Damage:           ' + selectedObj.damageOutput[selectedObj.level],
      550,
      250,
    );
    ctx.fillText(
      'Attack radius:    ' + selectedObj.attackRadius[selectedObj.level],
      550,
      270,
    );
    ctx.fillText(
      'Attack rate:       ' + selectedObj.attackRate[selectedObj.level],
      550,
      290,
    );

    drawSellButton();
    drawUpgradeButton();

    ctx.closePath();
    ctx.fill();
  }
}

function drawSellButton() {
  ctx.beginPath();
  ctx.rect(565, 320, 120, 40);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#FFDCA8';
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = '#FFDCA8';
  ctx.font = '18px sans-serif';
  ctx.fillText('SELL', 600, 347);
  ctx.closePath();
  ctx.fill();
}

function drawUpgradeButton() {
  ctx.beginPath();
  ctx.rect(705, 320, 120, 40);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#FFDCA8';
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = '#FFDCA8';
  ctx.font = '18px sans-serif';
  ctx.fillText('UPGRADE', 720, 347);
  ctx.closePath();
  ctx.fill();
}

function drawCursorImage() {
  // If cursorImg is not set, return
  if (cursorImg == null) {
    return;
  }

  // Display red inside the circle if
  // building is not allowed at this spot
  if (_buildAllowed == false) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  }

  ctx.beginPath();
  ctx.drawImage(cursorImg.image, cursorImg.x, cursorImg.y);
  ctx.arc(cursorImg.x + 17, cursorImg.y + 17, 50, 0, Math.PI * 2, true);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#999';
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
}

function drawStartButton() {
  ctx.beginPath();
  ctx.rect(620, 517, 120, 50);
  ctx.fillStyle = '#C43333';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#222';
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = '#000';
  ctx.font = '24px sans-serif';
  ctx.fillText('START', 640, 550);
  ctx.closePath();
  ctx.fill();
}

function drawStats() {
  var scoreTxt = 'Score                        ' + _scores;
  var moneyTxt = 'Money left                ' + _money;
  var coffeeLeft = 100 - 10 * _enemiesPassed;
  var coffeeTxt = 'Coffee left                ' + coffeeLeft;

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.font = '22px sans-serif';
  ctx.fillText(moneyTxt, 580, 430);
  ctx.fillText(coffeeTxt, 580, 450);
  ctx.fillText(scoreTxt, 580, 480);
  ctx.closePath();
  ctx.fill();
}

function drawScoreButton() {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.strokeStyle = '#333';
  ctx.strokeRect(589, 417, 100, 50);
  ctx.font = '24px sans-serif';
  ctx.fillText('START', 600, 450);
  ctx.closePath();
  ctx.fill();
}

function gameLoop() {
  clear();

  drawScene();
  drawInventory();
  drawCursorImage();
  drawSceneObjects();
  drawStats();
  drawWaveTimer();
  drawFpsCounter();

  if (_gameRunning) {
    moveEnemies();
    objects_checkForEnemies();
    moveProjectiles();

    drawEnemies();
    drawProjectiles();
  }

  if (!_gameRunning) drawStartButton();

  frameCount++;
}

// Starts the game timer that calls
// gameLoop() every 14ms
function startGameTimer() {
  var mspf = 15;

  function timer() {
    gameLoop();
    window.setTimeout(timer, mspf);
  }

  window.setTimeout(timer, mspf);
}

// Starts the timer that calls fps()
// every 1000ms.
function startFPSCounter() {
  var mspf = 1000;
  lastLoop = new Date().getTime();

  function instance() {
    fps();
    window.setTimeout(instance, mspf);
  }

  window.setTimeout(instance, mspf);
}

function drawFpsCounter() {
  ctx.beginPath();
  ctx.fillStyle = '#000';
  ctx.font = '18px sans-serif';
  ctx.fillText('' + FPS + ' fps', 845, 585);
  ctx.closePath();
  ctx.fill();
}

function fps() {
  FPS = frameCount;
  frameCount = 0;
}

// Checks if coordinates are in range
// (inside the scene)
function isInRange(x, y) {
  var inRange = true;

  if (
    x < sceneX ||
    x > sceneEndX - tileSize ||
    y < sceneY ||
    y > sceneEndY - tileSize
  ) {
    inRange = false;
  }

  if (x == sceneEndX && y == 270) {
    inRange = true;
  }

  return inRange;
}

// Checks if the tile in the given
// coordinates is already occupied.
function isOccupied(x, y) {
  var occupied = false;

  var i = (x - sceneX) / tileSize;
  var j = (y - sceneY) / tileSize;

  if (sceneObj[i] != null && sceneObj[i][j] != null) {
    occupied = true;
  }

  return occupied;
}

// Finds the series of steps (waypoints)
// for an enemy to reach the target
function findPath(x, y, xd, yd) {
  var x_original = x;
  var y_original = y;

  var open = [];
  var count = 0;
  open.push([xd, yd, count]);

  for (var g = 0; g < open.length; g++) {
    x = open[g][0];
    y = open[g][1];
    count++;

    var arr = [];
    arr.push([x - tileSize, y, count]);
    arr.push([x + tileSize, y, count]);
    arr.push([x, y - tileSize, count]);
    arr.push([x, y + tileSize, count]);

    // Take out choices that are out of range
    // or otherwise cannot be traversed to.
    var o = arr.length - 1;
    while (o >= 0) {
      if (typeof arr[o] == 'undefined') {
        break;
      }

      var xx = arr[o][0];
      var yy = arr[o][1];

      var outOfRange = !isInRange(xx, yy);
      var tileOccupied = isOccupied(xx, yy);

      var existsInOpenList = false;

      for (var h = 0; h < open.length; h++) {
        if (xx == open[h][0] && yy == open[h][1]) {
          if (arr[o][2] >= open[h][2]) {
            existsInOpenList = true;
          }
        }
      }

      if (outOfRange || tileOccupied || existsInOpenList) {
        arr.splice(o, 1);
      }

      o--;
    }

    for (var i = 0; i < arr.length; i++) {
      open.push(arr[i]);
    }
  }

  x = x_original;
  y = y_original;
  var waypoints = [];
  var foundPath = false;

  while (true) {
    var lowestI = -1;
    var lowest = 999999;

    for (var f = 0; f < open.length; f++) {
      var isANearByCell = false;

      if (x + 30 == open[f][0] && y == open[f][1]) {
        isANearByCell = true;
      }
      if (x - 30 == open[f][0] && y == open[f][1]) {
        isANearByCell = true;
      }
      if (x == open[f][0] && y + 30 == open[f][1]) {
        isANearByCell = true;
      }
      if (x == open[f][0] && y - 30 == open[f][1]) {
        isANearByCell = true;
      }

      if (isANearByCell == true && lowest > open[f][2]) {
        lowest = open[f][2];
        lowestI = f;
      } else if (isANearByCell == true && lowest == open[f][2]) {
        var rand = Math.floor(Math.random() * 2);
        if (rand == 0) {
          lowest = open[f][2];
          lowestI = f;
        }
      }
    }

    if (lowestI == -1) {
      break;
    }

    var xx = open[lowestI][0] - x;
    var yy = open[lowestI][1] - y;

    waypoints.push([xx, yy]);

    x = open[lowestI][0];
    y = open[lowestI][1];

    if (open[lowestI][2] == 0) {
      foundPath = true;
      break;
    }
  }

  if (foundPath) {
    return waypoints;
  } else {
    return null;
  }
}

function updateEnemyPaths() {
  for (var i = 0; i < enemies.length; i++) {
    // Get the index of "latest" waypoint
    var l = 0;
    while (true) {
      var wp = enemies[i].wp[l];

      if (wp[0] != 0 || wp[1] != 0) {
        break;
      }

      l++;
    }

    // Add to the current x and y to what
    // remains of the "latest" waypoint,
    // so that we get a proper coordinates
    // of a tile.
    var nextX = enemies[i].x + wp[0];
    var nextY = enemies[i].y + wp[1];

    // Get the new waypoints
    var newWp = findPath(nextX, nextY, 480, 270);

    if (newWp == null) {
      return false;
    }

    // Add up the new waypoints
    // with the latest waypoint
    var compWp = [];
    compWp.push(enemies[i].wp[l]);

    for (var j = 0; j < newWp.length; j++) {
      compWp.push(newWp[j]);
    }

    // Set the enemy's waypoints
    enemies[i].wp = compWp;
  }

  return true;
}

function initGame() {
  _gameRunning = false;

  stopSpawnTimer();
  stopWaveTimer();

  enemies.length = 0;
  sceneObj.length = 0;
  projectiles.length = 0;

  selectedInv = null;
  selectedObj = null;

  _money = 300;
  _scores = 0;
  _enemiesPassed = 0;
  _buildAllowed = true;
  _currentWave = 0;
  _timeToNextWave = 0;

  for (var i = 0; i < sceneWidth / tileSize; i++) {
    sceneObj[i] = [];

    for (var j = 0; j < sceneHeight / tileSize; j++) {
      sceneObj[i][j] = null;
    }
  }
}

loadImages();
startGameTimer();
startFPSCounter();
initGame();
