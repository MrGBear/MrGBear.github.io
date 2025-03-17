// validation --> benutzen wir das schon oder nur für backend

function validatePlayer(player) {
    if (typeof player.player_id !== 'number') {
        throw new Error('Invalid player_id');
    }
    if (!Array.isArray(player.games)) {
        throw new Error('Invalid games array');
    }
    player.games.forEach(validateGame);
}

function validateGame(game) {
    if (typeof game.game_id !== 'number') {
        throw new Error('Invalid game_id');
    }
    if (typeof game.course_name !== 'string') {
        throw new Error('Invalid course_name');
    }
    if (typeof game.course_rating !== 'number') {
        throw new Error('Invalid course_rating');
    }
    if (typeof game.slope_rating !== 'number') {
        throw new Error('Invalid slope_rating');
    }
    if (typeof game.ppc !== 'number') {
        throw new Error('Invalid ppc');
    }
    if (typeof game.date !== 'number') {
        throw new Error('Invalid date: Should be a number');
    }
    if (!Array.isArray(game.holes)) {
        throw new Error('Invalid holes array');
    }
    if (typeof game.score_differential !== 'number') {
        throw new Error('Invalid score_differential');
    }
    if (typeof game.stableford !== 'number') {
        throw new Error('Invalid stableford');
    }
    if (typeof game.ega !== 'number') {
        throw new Error('Invalid ega');
    }
    if (typeof game.whs !== 'number') {
        throw new Error('Invalid whs');
    }

    game.holes.forEach(validateHole);
}

function validateHole(hole) {
    if (typeof hole.pos !== 'number') {
        throw new Error('Invalid hole pos');
    }
    if (typeof hole.par !== 'number') {
        throw new Error('Invalid hole par');
    }
    if (typeof hole.gbe !== 'number' && hole.gbe !== undefined) {
        throw new Error('Invalid hole gbe');
    }
    if (typeof hole.hdc !== 'number') {
        throw new Error('Invalid hole hdc');
    }
}


//EXPORT
export const validator = {
    validatePlayer,
    validateGame,
    validateHole
}