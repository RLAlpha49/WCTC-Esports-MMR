-- Create the All table within the Players schema
CREATE TABLE Players.All (
  playerid SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  status VARCHAR(255) DEFAULT 'current'
);

-- Create the RocketLeague table within the Players schema
CREATE TABLE Players.RocketLeague (
  playerid INTEGER PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playerid) REFERENCES Players.All(playerid)
);

-- Create the RocketLeague table within the MMR schema
CREATE TABLE MMR.RocketLeague (
  playerid INTEGER PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  mmr3s INTEGER,
  mmr2s INTEGER,
  mmr1s INTEGER,
  FOREIGN KEY (playerid) REFERENCES Players.All(playerid)
);