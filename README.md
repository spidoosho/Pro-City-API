# Pro City API

API that retrieves data from DynamoDB database.

## Available commands

### `/`

Scan the database for a table called `LEADERBOARD_TABLE_NAME`

### `/leaderboard`

Scan `LEADERBOARD_TABLE_NAME` for players sorted in descending order of players' ratings.

### `/leaderboard/text`

Scan `LEADERBOARD_TABLE_NAME` for players sorted in descending order of players' ratings, but sends a response in a human readable string for Twitch commands purposes.

### `/player/:username`

Scan `LEADERBOARD_TABLE_NAME` for a player named `:username`. Returns raw data.

### `/player/:username/text`

Scan `LEADERBOARD_TABLE_NAME` for a player named `:username`, sends a response in a human readable string for Twitch commands purposes.
