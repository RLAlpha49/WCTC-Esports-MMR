# WCTC-Esports-MMR

This project is a Node.js application that uses the Express.js framework to serve a web page displaying player data for the esports teams. The application fetches player data from an API and renders it on the web page using EJS (Embedded JavaScript) templates.

Additionally, the application uses PostgreSQL functions to add or update player data in the `Players.RocketLeague` table and to retrieve all player data from the same table.

## How to Run

1. Install dependencies with `npm install`.
2. Start the server with `npm start`.
3. Open a web browser and navigate to `http://localhost:3000`.

Please note that you need to provide your own API key in a `.env` file for the application to fetch player data. In format of `API_KEY=your_api_key_here`.

Additionally, you need to provide the database connection details in the `.env` file:

```env
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Replace `your_database_host`, `your_database_port`, `your_database_user`, `your_database_password`, and `your_database_name` with your actual PostgreSQL database connection details.

## PostgreSQL Functions

The project has one PostgreSQL function:

1. `add_or_update_player(input_username VARCHAR(255), input_status VARCHAR(255), input_team VARCHAR(255))`: This function adds a new player or updates an existing player's data in the `Players.RocketLeague` table.

You can call this function as follows:

```sql
SELECT * FROM Players.add_or_update_player('existing_username', 'new_status', 'new_team');
```

Please replace `existing_username`, `new_status`, and `new_team` with the username, new status, and new team of the player you want to add or update.
