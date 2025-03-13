// Module to function as an API for getting and saving Data 



//Config
const FILEPATH = "./data/userdata.json";

//Default JSON OBJECTS
const default_value = {};
const defaultgame = {};


const dataObject = {
    "player": {
        "player_id": 1,
        "player_name": "test",
        "games": [
            {
                "game_id": 1,
                "course_name": "Green Valley Golf Course",
                "course_rating": 72.5,
                "slope_rating": 113,
                "ppc": 0,
                "handicap_index": 12.4,
                "date": "2023-10-15",
                "score_differenital": 2.8,
                "stableford": 36,
                "ega": 11.9,
                "whs": 12.1,
                "holes": [
                    {
                        "pos": 1,
                        "hdc": 14,
                        "par": 4,
                        "gbe": 5
                    },
                    {
                        "pos": 2,
                        "hdc": 3,
                        "par": 3,
                        "gbe": 4
                    },
                    {
                        "pos": 3,
                        "hdc": 6,
                        "par": 5,
                        "gbe": 5
                    }
                ]
            }
        ]
    }
}

function getData() {
    return dataObject;
}

// Export Class for other modules to use
export class DataHandler{
    
    //Constructor
    constructor(){
        this.json_data = getData();
        this.current_user = 1;
    }

    //return the JSON data Object
    getJSON(){
        return this.json_data;
    }
    
    saveData(){
        //writeData(JSON.stringify(this.json_data));
    }


    //Export function, to guarantee deep copy
    exportObject(data, copy = true){
        if(copy){
            return JSON.parse(JSON.stringify(data));
        }
        return data;
    }

    /* User Management */

    //returns all User in an array with their ID and Name
    getUsers(){
        let players = [];
        for (let player in this.json_data){
            players.push({id: this.json_data[player].player_id, name: this.json_data[player].player_name});
        }
        return players;
    }

    //sets the current player
    //TODO: Passwordcheck
    //TODO: Check if User exists
    switchUser(id, password = null){
        this.current_user = id;
    }

    //Checks if a user is correcktly set, otherwise throws an error
    //Returns the user Data
    //TODO: Check if user exists
    getUserData(user = this.current_user, copy = true){
        if(user == null){
            throw new Error("User is not set. Please use the switchUser method to set a user");
        } 
        for (let player in this.json_data){
            if(this.json_data[player].player_id == user){
                return this.exportObject(this.json_data[player], copy);
            }
        }
    }

    /* Game Management */

    getGames(copy = true){
        const userData = this.getUserData(undefined, copy);
        return userData.games;
    }


    //Create a new Game for the current Player
    addGame(data){
        //copy Object
        data = this.exportObject(data);

        //Asumtion User is correctly set


        //get game ID
        const games = this.getGames();
        const game_id = games.reduce((max, game) => Math.max(max, game.game_id), 0) + 1;


        //Create the new Game
        let game = {};
        game.game_id = game_id;
        game.date = data.date;
        game.course_name = data.course_name;
        game.course_rating = data.course_rating;
        game.slope_rating = data.slope_rating;
        game.pcc = data.pcc;
        game.holes = data.holes; 
        game.ega = null;
        game.whs = null;

        //Calculate the Handicap(WHS, EGS)
        //TODO: call functions
        

        //Add game to the JSON 
        this.getGames(false).push(game);
        this.saveData();
        return this.exportObject(game);
    }

    modGame(){

    }

    loadGame(game_id){  
        const games = this.getGames();
        const game = games.find(game => game.game_id == game_id);
        return this.exportObject(game);
    }

    removeGame(game_id){
        const games = this.getGames(false);
        const index = games.findIndex(game => game.game_id == game_id);
        if(index != -1){
            games.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
}

//EXPORT
export const backendCalc = new DataHandler();