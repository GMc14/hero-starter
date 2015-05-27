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
var OppositeDirection = {North:'South', East:'West', South:'North', West:'East'};
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

    console.log("Logging Move...");
    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'HealthWell';
    });
    //Get stats on the nearest nonTeam mine
    var mineStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      if (boardTile.type === 'DiamondMine') {
        if (boardTile.owner) {
          return boardTile.owner.team !== myHero.team || boardTile.owner.dead;
        } else {
          return true;
        }
      }
        return false;
      
    });
    
        //Get stats on the nearest nonTeam mine
    var anyMineStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      if (boardTile.type === 'DiamondMine') {
        if (boardTile.owner) {
          return boardTile.owner !== myHero.team;
        } else {
          return true;
        }
      }
        return false;
      
    });
        //Get stats on the nearest weak enemy
    var crippledEnemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team !== myHero.team && boardTile.health <= 20;
    });
    
    
    //Get stats on the nearest weak enemy
    var weakEnemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team !== myHero.team && (boardTile.health < myHero.health - 10 || boardTile.health <= 20) ;
    });
    
        //Get stats on the nearest weak enemy
    var scaryEnemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team !== myHero.team && boardTile.health > myHero.health;
    });
    
    //Get stats on the nearest friend in need
    var friendlyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.type === 'Hero' && boardTile.team === myHero.team && boardTile.health < 50;
    });
    
        //Get stats on the nearest friend in need
    var bonesStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.subType === 'Bones';
    });
    
    var unoccupiedStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      return boardTile.subType === 'Unoccupied';
    });
    
    
    console.log("getting stats...");
    var distanceToHealthWell = healthWellStats.distance;
    var directionToHealthWell = healthWellStats.direction;
        
    var distanceToFriend = friendlyStats.distance;
    var directionToFriend = friendlyStats.direction;
    
    var distanceToWeakEnemy = weakEnemyStats.distance;
    var directionToWeakEnemy = weakEnemyStats.direction;
    
    var distanceToCrippledEnemy = crippledEnemyStats.distance;
    var directionToCrippledEnemy = crippledEnemyStats.direction;
    
    
    var distanceToMine = mineStats.distance;
    var directionToMine = mineStats.direction;
  
    var distanceToAnyMine = anyMineStats.distance;
    var directionToAnyMine = anyMineStats.direction;
    
    var distanceToScaryEnemy = scaryEnemyStats.distance;
    var directionToScaryEnemy = scaryEnemyStats.direction;
    
    var distanceToBones = bonesStats.distance;
    var directionToBones = bonesStats.direction;
    
    var distanceToUnoccupied = unoccupiedStats.distance;
    var directionToUnoccupied = unoccupiedStats.direction;
    
    console.log("Stats...");

    console.log("distanceToBones: "+distanceToBones);
    console.log("distanceToScaryEnemy: "+distanceToScaryEnemy);
    console.log("distanceToMine: "+distanceToMine);
    console.log("distanceToHealthWell: "+distanceToHealthWell);
    console.log("distanceToFriend: "+ distanceToFriend);
    console.log("distanceToWeakEnemy: "+distanceToWeakEnemy);
    console.log("distanceToUnoccupied: "+distanceToUnoccupied);
    
    console.log("...[][][]...");    
    
    console.log("directionToBones: "+directionToBones);
    console.log("directionToScaryEnemy: "+directionToScaryEnemy);
    console.log("directionToMine: "+directionToMine);
    console.log("directionToHealthWell: "+directionToHealthWell);
    console.log("directionToFriend: "+ directionToFriend);
    console.log("directionToWeakEnemy: "+directionToWeakEnemy);
    console.log("directionToUnoccupied: "+directionToUnoccupied);
    
    if (directionToCrippledEnemy && distanceToCrippledEnemy <= 2) {
     console.log("Shoot First");
     return directionToCrippledEnemy;
    }
    var shouldLookForSafety = myHero.health <= (81  - (gameData.turn/17)) && distanceToScaryEnemy <= 2;
    console.log("Health:"+myHero.health);
    console.log("shouldLookForSafety:"+shouldLookForSafety);
    if (distanceToHealthWell === 1 && (myHero.health <= 60 || shouldLookForSafety)) {
      console.log("Quick heal");
      return directionToHealthWell;
    } 

    if (myHero.health <= 40 || shouldLookForSafety) {
      if (directionToHealthWell && distanceToHealthWell <= 2) {
        console.log("Go to heal now!");
        return directionToHealthWell;
      }
      if (directionToFriend && distanceToFriend <= 2 && (distanceToScaryEnemy > distanceToFriend || directionToScaryEnemy !== directionToFriend)) {
        console.log("Go to friend to heal");
        return directionToFriend;
      }
    }
    
    if (directionToMine && myHero.health > 20 && distanceToMine <= 2 && (distanceToScaryEnemy > distanceToMine || directionToScaryEnemy !== directionToMine)) {
     console.log("Go to mine");
     return directionToMine;
    }
    
    if (directionToWeakEnemy && distanceToWeakEnemy <= 2 && (distanceToScaryEnemy > distanceToWeakEnemy || directionToScaryEnemy !== directionToWeakEnemy)) {
     console.log("Go to WeakEnemy");
     return directionToWeakEnemy;
    }
    
    if (shouldLookForSafety) {
      //RUN!

      if (OppositeDirection[directionToScaryEnemy] === directionToUnoccupied) {
        console.log("Go to Opposite Dirction");
        return directionToUnoccupied;
      }
     if (gameData.board.getTileNearby(myHero.distanceFromTop,myHero.distanceFromLeft,OppositeDirection[directionToScaryEnemy]).type === "Unoccupied")
     {
       console.log("Go to Opposite Direction 2");
      return OppositeDirection[directionToScaryEnemy];
     }
      return = OppositeDirection[Math.floor(Math.random()*OppositeDirection.length)];
        
      if (directionToScaryEnemy !== directionToUnoccupied && myHero.health < 90) {
        console.log("Go to Unoccupied!!");
        return directionToUnoccupied;
      }
    }
    
    if (directionToFriend && distanceToFriend < 4 && (directionToMine === directionToFriend || directionToBones === directionToFriend || directionToWeakEnemy === directionToFriend || distanceToFriend < 2) && distanceToScaryEnemy > 1 && (distanceToScaryEnemy > distanceToFriend || directionToScaryEnemy !== directionToFriend)) {
      console.log("Go to friend");
      return directionToFriend;
    }
    
    for (n = 2; n < 99; n++) { 
      if (directionToWeakEnemy && distanceToWeakEnemy < n){
        //unpredictable
        console.log("WeakEnemy");
        return directionToWeakEnemy;
      }
      if (directionToBones && distanceToBones < n+1 && directionToBones !== directionToScaryEnemy){
        console.log("Bones");
        return directionToBones;
      }
      if (directionToMine && distanceToMine < n+1 && myHero.health > 30){
        console.log("Mine");
        return directionToMine;
      }
      if (directionToHealthWell && distanceToHealthWell < n && myHero.health < (50 + 5*n) && n < 10) {
        console.log("Health Well");
        return directionToHealthWell;
      } 
      if (directionToFriend && distanceToFriend < n){
        //unreliable
        console.log("Friend");
        return directionToFriend;
      }
    }
    if (directionToHealthWell){
      return directionToHealthWell;
    }
    console.log("Default result");
    return directionToUnoccupied;
    
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
