CREATE OR REPLACE FUNCTION Players.add_or_update_player(input_username VARCHAR(255), input_status VARCHAR(255), input_team VARCHAR(255))
RETURNS TABLE (input_playerid INTEGER, username VARCHAR(255), team VARCHAR(255)) AS $$
DECLARE
  existing_playerid INTEGER;
BEGIN
  -- Check if player already exists in Players.All
  SELECT Players.All.playerid INTO existing_playerid FROM Players.All WHERE Players.All.username = input_username;

  IF existing_playerid IS NULL THEN
    -- If player does not exist, insert into Players.All and Players.RocketLeague
    INSERT INTO Players.All (username, status) VALUES (input_username, input_status) RETURNING playerid INTO existing_playerid;
    INSERT INTO Players.RocketLeague (playerid, username, team) VALUES (existing_playerid, input_username, input_team);
  ELSE
    -- If player exists, update status in Players.All and team in Players.RocketLeague
    UPDATE Players.All SET status = input_status WHERE Players.All.playerid = existing_playerid;
    UPDATE Players.RocketLeague SET team = input_team WHERE Players.RocketLeague.playerid = existing_playerid;
  END IF;

  -- Return the updated rows from Players.RocketLeague
  RETURN QUERY SELECT Players.RocketLeague.playerid AS input_playerid, Players.RocketLeague.username, Players.RocketLeague.team FROM Players.RocketLeague WHERE Players.RocketLeague.playerid = existing_playerid;
END;
$$ LANGUAGE plpgsql;

Players.add_or_update_player('existing_username', 'new_status', 'new_team');