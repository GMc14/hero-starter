/*

  Strategies for the hero are contained within the "moves" object as
  name-value pairs, like so:

    //...
    ambusher : function(gamedData, helpers){
      // implementation of strategy.
    },
    heWhoLivesToFightAnotherDay: function(gamedData, helpers){
      // implementation of strategy.
    },
    //...other strategy definitions.

  The "moves" object only contains the data, but in order for a specific
  strategy to be implemented we MUST set the "move" variable to a
  definite property.  This is done like so:

  move = moves.heWhoLivesToFightAnotherDay;

  You MUST also export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")

  The "move" function should accept two arguments that the website will be passing in:
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/#rules)

  Such is the power of Javascript!!!

*/

// Strategy definitions
var moves = {
  // Aggressor
  aggressor: function(gameData, helpers) {
    // Here, we ask if your hero's health is below 30
    if (gameData.activeHero.health <= 30){
      // If it is, head towards the nearest health well
      return helpers.findNearestHealthWell(gameData);
    } else {
      // Otherwise, go attack someone...anyone.
      return helpers.findNearestEnemy(gameData);
    }
  },

  // Health Nut
  healthNut:  function(gameData, helpers) {
    // Here, we ask if your hero's health is below 75
    if (gameData.activeHero.health <= 75){
      // If it is, head towards the nearest health well
      return helpers.findNearestHealthWell(gameData);
    } else {
      // Otherwise, go mine some diamonds!!!
      return helpers.findNearestNonTeamDiamondMine(gameData);
    }
  },

  // Balanced
  balanced: function(gameData, helpers){
    //FIXME : fix;
    return null;
  },

  // The "Northerner"
  // This hero will walk North.  Always.
  northener : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    return 'North';
  },

  // The "Blind Man"
  // This hero will walk in a random direction each turn.
  blindMan : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    var choices = ['North', 'South', 'East', 'West'];
    return choices[Math.floor(Math.random()*4)];
  },

  // The "Priest"
  // This hero will heal nearby friendly champions.
  priest : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    if (myHero.health < 60) {
      return helpers.findNearestHealthWell(gameData);
    } else {
      return helpers.findNearestTeamMember(gameData);
    }
  },

  // The "Unwise Assassin"
  // This hero will attempt to kill the closest enemy hero. No matter what.
  unwiseAssassin : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    if (myHero.health < 30) {
      return helpers.findNearestHealthWell(gameData);
    } else {
      return helpers.findNearestEnemy(gameData);
    }
  },

  // The "Careful Assassin"
  // This hero will attempt to kill the closest weaker enemy hero.
  carefulAssassin : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    if (myHero.health < 50) {
      return helpers.findNearestHealthWell(gameData);
    } else {
      return helpers.findNearestWeakerEnemy(gameData);
    }
  },

  // The "Safe Diamond Miner"
  // This hero will attempt to capture enemy diamond mines.
  safeDiamondMiner : function(gameData, helpers) {
    var myHero = gameData.activeHero;

    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'HealthWell';
    });
    //Get stats on the nearest nonTeam mine
    var mineStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      if (boardTile.type === 'DiamondMine') {
        if (boardTile.owner) {
          return boardTile.owner.team !== hero.team;
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
    
    //Get stats on the nearest weak enemy
    var enemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team !== hero.team && boardTile.health < hero.health - 20;
    });
    
        //Get stats on the nearest weak enemy
    var scaryEnemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team !== hero.team && boardTile.health >= hero.health;
    });
    
    //Get stats on the nearest friend in need
    var friendlyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team === hero.team && boardTile.health < 60;
    });
    
    
    var distanceToHealthWell = healthWellStats.distance;
    var directionToHealthWell = healthWellStats.direction;
        
    var distanceToFriend = friendlyStats.distance;
    var directionToFriend = friendlyStats.direction;
    
    var distanceToEnemy = enemyStats.distance;
    var directionToEnemy = enemyStats.direction;
    
    var distanceToMine = mineStats.distance;
    var directionToMine = mineStats.direction;
    
    var distanceToScaryEnemy = scaryEnemyStats.distance;
    var directionToScaryEnemy = scaryEnemyStats.direction;
    
    if (distanceToHealthWell === 1 && myHero.health < 70) {
      //jackpot, stay near hear
      return directionToHealthWell;
    } 
    
    if (myHero.health < 50) {
      if (distanceToHealthWell <= distanceToFriend) {
        return directionToHealthWell;
      }
      if (distanceToScaryEnemy > distanceToFriend || directionToScaryEnemy !=== directionToFriend) {
        return directionToFriend;
      }
    }
    
    if (distanceToMine <= 2 && (distanceToScaryEnemy > distanceToMine || directionToScaryEnemy !=== directionToMine)) {
     return directionToMine;
    }
    
    if (distanceToEnemy <= 3 && (distanceToScaryEnemy > distanceToEnemy || directionToScaryEnemy !=== directionToEnemy)) {
     return directionToEnemy;
    }
    
    if ((directionToEnemy === directionToFriend || distanceToFriend <= 2) && (distanceToScaryEnemy > distanceToFriend || directionToScaryEnemy !=== directionToFriend)) {
      return directionToFriend;
    }

    return helpers.findNearestNonTeamDiamondMine(gameData);
    
  },

  // The "Selfish Diamond Miner"
  // This hero will attempt to capture diamond mines (even those owned by teammates).
  selfishDiamondMiner :function(gameData, helpers) {
    var myHero = gameData.activeHero;

    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      if (boardTile.type === 'HealthWell') {
        return true;
      }
    });

    var distanceToHealthWell = healthWellStats.distance;
    var directionToHealthWell = healthWellStats.direction;

    if (myHero.health < 40) {
      //Heal no matter what if low health
      return directionToHealthWell;
    } else if (myHero.health < 100 && distanceToHealthWell === 1) {
      //Heal if you aren't full health and are close to a health well already
      return directionToHealthWell;
    } else {
      //If healthy, go capture a diamond mine!
      return helpers.findNearestUnownedDiamondMine(gameData);
    }
  },

  // The "Coward"
  // This hero will try really hard not to die.
  coward : function(gameData, helpers) {
    return helpers.findNearestHealthWell(gameData);
  }
 };

//  Set our heros strategy
var  move =  moves.safeDiamondMiner;

// Export the move function here
module.exports = move;
