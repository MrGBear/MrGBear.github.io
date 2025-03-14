"use strict";

class EgaCategory {
    static CBA_REDUCTION_ONLY = "-2&RO";
    constructor(category, interval, buffer_zone, improve_handicap, reduce_handicap) {
        this.category = category;
        this.interval = interval;
        this.buffer_zone = buffer_zone;
        this.improve_handicap = improve_handicap;
        this.disimprove_handicap = reduce_handicap * -1;
    }

    /**
     * Check if the handicap is in the interval of the category
     * @param handicap The handicap to check
     */
    in_interval(handicap) {
        return this.interval.start <= handicap && handicap <= this.interval.end;
    }

    /**
     * Check if the handicap is in the buffer zone of the category
     * @param stable_ford The stable ford points the player got
     * @param hole_length The number of holes the player played (9 or 18) else an error is thrown
     * @returns True if the handicap is in the buffer zone, false otherwise
     */
    in_buffer_zone(stable_ford, hole_length, cba = 0) {
        if (hole_length !== 9 && hole_length !== 18) {
            console.assert(false, "The number of holes must be 9 or 18");
            throw new Error("The number of holes must be 9 or 18");
        }
        if (cba === EgaCategory.CBA_REDUCTION_ONLY) {
            return true;
        }
        return hole_length === 18 ? (this.buffer_zone.hole_18 + cba) <= stable_ford : (this.buffer_zone.hole_9 + cba) <= stable_ford;
    }

    /**
     * Calculate the handicap if the player played better than the handicap
     * @param handicap
     * @param stable_ford_diff The difference between the stable ford points and 36 (stable ford points - 36)
     */
    get_improved_handicap(handicap, stable_ford_diff) {
        return handicap + (this.improve_handicap * stable_ford_diff);
    }

    /**
     * Calculate the handicap if the player played worse than the handicap
     * @param handicap
     * @param stable_ford_diff The difference between the stable ford points and 36 (36 - stable ford points)
     */
    get_disimproved_handicap(handicap, stable_ford_diff) {
        return handicap + (this.disimprove_handicap * stable_ford_diff);
    }
}

class EgaCategories {
    constructor(categories) {
        this.categories = categories;
    }

    /**
     * Get the category of the handicap
     * @param handicap The handicap to get the category for
     */
    get_category(handicap) {
        for (let category of this.categories) {
            if (category.in_interval(handicap)) {
                return category;
            }
        }
        return this.categories[this.categories.length - 1];
    }
}

class EgaCalculator {
    /// Constants
    // Buffer zone
    static NO_BUFFER_ZONE = 37;
    static ALL_BUFFER_ZONE = 0;
    // Gbe if not set / not played / given up
    static NOT_PLAYED = undefined;
    // CBA
    static CBA_REDUCTION_ONLY = EgaCategory.CBA_REDUCTION_ONLY;
    constructor() {
        this.ega_classes = new EgaCategories([
            new EgaCategory(6, { start: -54, end: -37 }, {
                hole_18: EgaCalculator.ALL_BUFFER_ZONE,
                hole_9: EgaCalculator.ALL_BUFFER_ZONE
            }, 1, 0 // 0 means the handicap can not get worse
            ),
            new EgaCategory(5, { start: -36, end: -26.5 }, {
                hole_18: EgaCalculator.ALL_BUFFER_ZONE,
                hole_9: EgaCalculator.ALL_BUFFER_ZONE
            }, 0.5, 0 // 0 means the handicap can not get worse
            ),
            new EgaCategory(4, { start: -26.4, end: -18.5 }, { hole_18: 32, hole_9: 34 }, 0.4, 0.1),
            new EgaCategory(3, { start: -18.4, end: -11.5 }, { hole_18: 33, hole_9: 35 }, 0.3, 0.1),
            new EgaCategory(2, { start: -11.4, end: -4.5 }, { hole_18: 34, hole_9: 36 }, 0.2, 0.1),
            new EgaCategory(1, { start: -4.4, end: 4.0 }, { hole_18: 35, hole_9: EgaCalculator.NO_BUFFER_ZONE }, 0.1, 0.1),
        ]);
        /**
         * Calculate the game with the given game state
         * @param game
         */
        this.get_calculated_game = (game, old_ega) => {
            const prep_game = this.prepareGame(game, old_ega);
            const playing_handicap = this.calculate_playing_handicap(prep_game.handicap_index, prep_game.slope_rating, prep_game.course_rating, prep_game.holes);
            const stable_ford = this.calculate_stable_ford(playing_handicap, prep_game.holes);
            const new_handicap = this.calculate_new_handicap(prep_game.handicap_index, stable_ford, prep_game.holes.length, prep_game.cba); // TODO implement CBA? // See TODO_EGA

            // Update Game Stats
            game.stableford = stable_ford; // Store the stable ford points
            game.ega = new_handicap; // Store the new handicap
            return game;
        };
        /**
         * Prepare the game state for the calculation
         *
         * @param game The game state to prepare
         * @param old_ega The old EGA handicap of the player
         * @returns The game Object with prepared data
         */
        this.prepareGame = (game, old_ega) => {

            // Set the old EGA handicap
            game.handicap_index = old_ega

            if (game.cba === undefined) {
                game.cba = 0;
            }

            {
                const { handicap_index, course_rating, slope_rating, holes } = game;
                // Check the input parameters
                const checkType = (obj) => {
                    const key = Object.keys(obj).find(k => k !== 'type');
                    if (key && typeof obj[key] !== obj.type) {
                        throw new Error(`The field ${key} is not of type ${obj.type}`);
                    }
                };
                checkType({ handicap_index, type: "number" });
                checkType({ course_rating, type: "number" });
                checkType({ slope_rating, type: "number" });
                checkType({ holes, type: "object" });
            }
            // Check the hole input
            const preparedGame = game;
            if (preparedGame.holes.length > 18) {
                console.assert(false, "The number of holes must be 18 or less");
                throw new Error("The number of holes must be 18 or less");
            }
            if (!(preparedGame.holes.length === 9 || preparedGame.holes.length === 18)) {
                console.assert(false, "The number of holes must be 9 or 18");
                throw new Error("The number of holes must be 9 or 18");
            }
            preparedGame.holes = preparedGame.holes.map((hole) => {
                hole.gbe = hole.gbe ? hole.gbe : EgaCalculator.NOT_PLAYED;
                return hole;
            });
            return preparedGame;
        };
        this.get_ega_category = (handicap) => {
            return this.ega_classes.get_category(handicap);
        };
        /**
         * Calculate the playing handicap for the field
         * @param ega_handicap The EGA handicap of the player at the moment of the game
         * @param slope_rating The slope rating of the course
         * @param course_rating The course rating of the course
         * @param holes The holes of the course with their par
         * @returns The playing handicap as a number (mostly positive)
         */
        this.calculate_playing_handicap = (ega_handicap, slope_rating, course_rating, holes) => {
            console.assert(holes.length === 9 || holes.length === 18, "The number of holes must be 9 or 18");
            let playing_handicap = null;
            // Get category
            let category = this.get_ega_category(ega_handicap);
            // Format handicap for formula
            ega_handicap = ega_handicap * -1;
            let par = holes.reduce((acc, hole) => acc + hole.par, 0);
            let match_str = [holes.length, category.category].toString();
            switch (match_str) {
                // 9 holes, category 1
                case "9,1": {
                    let msg = `This handicap: ${ega_handicap} of category 1 does not allow playing 9 holes`;
                    console.assert(false, msg);
                    throw new Error(msg);
                }
                // 9 holes, category 2-5
                case "9,2":
                case "9,3":
                case "9,4":
                case "9,5":
                    playing_handicap = (ega_handicap * (slope_rating / 113) / 2) + (course_rating - par);
                    break;
                // 18 holes, category 1-5
                case "18,1":
                case "18,2":
                case "18,3":
                case "18,4":
                case "18,5":
                    playing_handicap = (ega_handicap * slope_rating / 113) + (course_rating - par);
                    break;
                // 9 holes, category 6
                // 18 holes, category 6
                case "9,6":
                    ega_handicap = ega_handicap / 2;
                /* falls through */
                case "18,6": {
                    let differential = this.calculate_playing_handicap(-36, slope_rating, course_rating, holes) - 36;
                    playing_handicap = ega_handicap + differential;
                }
                    break;
                default:
                    throw new Error("Playing handicap could not be calculated");
            }
            if (playing_handicap === null) {
                throw new Error("Playing handicap could not be calculated");
            }
            return Math.round(playing_handicap);
        };
        /**
         * Calculate the stable ford points
         * @param playing_handicap The playing handicap of the player
         * @param holes The holes of the course with their par, gbe and stroke index
         */
        this.calculate_stable_ford = (playing_handicap, holes) => {
            console.assert(holes.length === 9 || holes.length === 18, "The number of holes must be 9 or 18");
            // Calculate the number of strokes the player gets on each hole
            {
                holes.forEach(hole => hole.temp_calc = 0);
                holes.sort((a, b) => a.hdc - b.hdc);
                let i = 0;
                while (playing_handicap > 0 && i < holes.length) {
                    let hole = holes[i];
                    hole.temp_calc = hole.temp_calc ? hole.temp_calc : 0;
                    hole.temp_calc++;
                    playing_handicap--;
                    i = (holes.length + i + 1) % holes.length;
                }
            }
            let stable_ford = holes.reduce((acc, hole) => {
                if (hole.gbe === EgaCalculator.NOT_PLAYED) {
                    return acc;
                } else {
                    // Possible Errors
                    if (hole.temp_calc === undefined) {
                        console.assert(false, "Error calculating the stableford number: ", "Array of holes ", holes, "The hole with the error", hole);
                        throw new Error("Error calculating the stableford number");
                    }
                    const diff = ((hole.par + hole.temp_calc) - hole.gbe);
                    const stable_ford = diff < -1 ? 0 : diff === -1 ? 1 : diff + 2;
                    return acc + stable_ford;
                }
            }, 0);
            if (holes.length === 9) {
                stable_ford = stable_ford + 18;
            }
            return stable_ford;
        };
        /**
         * Calculate the new handicap
         * @param old_handicap The old handicap of the player
         * @param stable_ford The stable ford points the player got
         * @param holes_length The number of holes the player played (9 or 18) else an error is thrown
         * @param cba The CBA of the course
         */
        this.calculate_new_handicap = (old_handicap, stable_ford, holes_length, cba) => {
            // Check input
            if (!(holes_length === 9 || holes_length === 18)) {
                console.assert(false, "The number of holes must be 9 or 18");
                throw new Error("The number of holes must be 9 or 18");
            }
            if (!(cba === -2 || cba === -1 || cba === 0 || cba === 1 || cba === 2 || cba === EgaCalculator.CBA_REDUCTION_ONLY)) {
                console.assert(false, "The CBA must be between -2 and 2 or -2&RO");
                throw new Error("The CBA must be between -2 and 2 or -2&RO");
            }
            // Calculate the new handicap
            // TODO implement the CBA to the calculation
            let ega_category = this.get_ega_category(old_handicap);
            const stable_ford_diff = stable_ford - 36;
            if (stable_ford_diff <= 0) {
                // Player played the handicap
                if (ega_category.in_buffer_zone(stable_ford, holes_length, cba)) {
                    // Reached the buffer zone
                    return old_handicap;
                } else {
                    // Not reached the buffer zone
                    return this.disimprove_handicap(old_handicap);
                }
            } else {
                // Player is better than the handicap
                return this.improve_handicap(old_handicap, stable_ford_diff);
            }
        };
        this.disimprove_handicap = (old_handicap) => {
            let ega_category = this.get_ega_category(old_handicap);
            old_handicap = ega_category.get_disimproved_handicap(old_handicap, 1);
            return this.round_to_tenth(old_handicap);
        };
        this.improve_handicap = (old_handicap, stable_ford_diff) => {
            for (let i = 0; i < stable_ford_diff; i++) {
                const ega_category = this.get_ega_category(old_handicap);
                old_handicap = ega_category.get_improved_handicap(old_handicap, 1);
            }
            return this.round_to_tenth(old_handicap);
        };
        this.round_to_tenth = (num) => {
            return Math.round(num * 10) / 10;
        };
    }
}


//EXPORT

/**
 * Calculate the EGA handicap
 * @param gamestats The game stats to calculate the EGA handicap for
 * @param old_ega Old EGA handicap of the player
 */
export const ega_calc = (gamestats, old_ega) => {
    return new EgaCalculator().get_calculated_game(gamestats, old_ega);
};

/**
 * Calculates the hdci of the last game
 * @param {*} games Array of games, with the last game that needs to be calculated. If more values are unset, than this function throws an error.
 * Outputs: {ega, stableford, handicap_index}
 */
export function calculate_ega(games) {
    let len = games.length
    let hdci = 54;

    if (len > 1) {
        hdci = games[len - 2].ega;
    }

    if (typeof hdci !== 'number') {
        throw new Error('The game before has no calculated value');
    }

    let game = ega_calc(games[len - 1], hdci * -1);

    let obj = {};
    obj.ega = game.ega * -1;
    obj.stableford = game.stableford;
    return obj;
}