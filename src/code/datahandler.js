// Module to function as an API for getting and saving Data 



//Config
import { Storage } from './localstorage_store.js';
import { calculate_ega } from './ega_handicap.js';

//overwrites localstorage function, always uses testdata
const usetest = false;

//Default JSON OBJECTS
const default_value = {
    "users": [
        {
            "user_id": 0,
            "user_name": "Sekretär",
            "password": "1234"
        }
    ],
    "courses": [

    ]
};

const dataObject = {
    "users": [
        {
            "user_id": 0,
            "user_name": "Sekretär",
            "password": "1234", 
            "role": "sekretaer" 
        },
        {
            "user_id": 1,
            "user_name": "Admin",
            "password": "1234", 
            "role": "spielführer" 
        },
        {
            "user_id": 2,
            "user_name": "Spieler",
            "password": "2345",
            "role": "spieler",
            "games": [
                {
                    "game_id": 1,
                    "course_name": "Green Valley Golf Course",
                    "course_id": null,
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
    ],
    "courses": [

    ]
};


function getData() {
    if(usetest){
        return dataObject;
    }
    let data = Storage.getData();
    if(!data){
        console.log("Using default");
        return dataObject;
    }
    return data;
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
        Storage.setData(this.json_data);
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
    getUsers() {
        console.log("Aktuelle Player-Daten:", this.json_data.users);

        if (!this.json_data.users) return [];

        if (Array.isArray(this.json_data.users)) {
            return this.json_data.users.map(player => ({
                id: player.user_id,
                name: player.user_name
            }));
        } else {
            return [{
                id: this.json_data.users.user_id,
                name: this.json_data.users.user_name
            }];
        }
    }


    //add a User
    // user_data = {user_name: "Name", password: "Password"}
    addUser(user_data){
        const users = this.json_data.users;
        const user_id = users.reduce((max, user) => Math.max(max, user.user_id), 0) + 1;

        let user = {
            user_id: user_id,
            user_name: user_data.user_name,
            password: user_data.password,
            role: user_data.role
        }
        users.push(user);
        this.saveData();
    }

    removeUser(user_id){
        const users = this.json_data.users;
        const index = users.findIndex(user => user.user_id == user_id);
        if(index != -1){
            users.splice(index, 1);
            this.saveData();
            return true;
        }
        return false
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
    getUserData(user_id = this.current_user, copy = true){
        if(user_id == null){
            throw new Error("User is not set. Please use the switchUser method to set a user");
        } 
        console.log(this.json_data.users.find(user => user.user_id == user_id))
        return this.json_data.users.find(user => user.user_id == user_id);
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

        //Check if gameid in data is set, otherwise create a new one
        if(!data.game_id){
            //get game ID
            const games = this.getGames();
            const game_id = games.reduce((max, game) => Math.max(max, game.game_id), 0) + 1;
            this.getGames(false).push({game_id: game_id});
            data.game_id = game_id;
        }

        return this.modGame(data.game_id, data);
    }

    modGame(game_id, data){
        const games = this.getGames(false);

        let game = games.find(game => game.game_id == game_id);
        if(!game){
            return false;
        }
        //Set/update data
        function setIfExist(key){
            if(data[key]){
                game[key] = data[key];
            }
        }
        setIfExist("date");
        setIfExist("course_name");
        setIfExist("course_rating");
        setIfExist("slope_rating");
        setIfExist("pcc");
        setIfExist("holes");
        //Set the handicap values to null, so the calculator will recalculate them
        game.whs = null;
        game.ega = null;

        //Calculate the Handicap
        this.updateHandicap();
        this.saveData();
        return this.exportObject(game);
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

    updateHandicap(){
        let games = this.getGames(false);
        //find the index of the changed game, every game after this has to be recalculated
        games.sort((a, b) => {if(a.date != b.date){return new Date(a.date) - new Date(b.date)} else {return a.game_id - b.game_id}});
        const min_index = games.findIndex(game => !game.whs || !game.ega);
        console.log("min Index:" + min_index);
        for(let i = min_index; i < games.length; i++){
            let subGames = this.exportObject(games.slice(0, i));
            
            const ega = calculate_ega(subGames);
            games[i].ega = ega.ega;
            games[i].stableford = ega.stableford;

            const whs = calculateWHS(subGames);
            games[i].whs = whs.whs; 
            games[i].score_differential = whs.score_differential;
        } 
        this.saveData();
    }
}


//EXPORT
export const backendCalc = new DataHandler();