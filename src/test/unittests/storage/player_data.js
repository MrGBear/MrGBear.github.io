const player_data = {
    player_id: 1,
    games: [
        {
            game: {
                game_id: 101,
                course_name: "Green Valley Golf Course",
                course_rating: 72.5,
                slope_rating: 113,
                ppc: 0,
                handicap_index: 12.4,
                date: Date.parse("2015-05-15T00:00:00.000Z"),
                holes: [
                    {
                        pos: 1,
                        hdc: 14,
                        par: 4,
                        gbe: 5
                    },
                    {
                        pos: 2,
                        hdc: 3,
                        par: 3,
                        gbe: 4
                    },
                    {
                        pos: 3,
                        hdc: 6,
                        par: 5,
                        gbe: 5
                    }
                ]
            },
            score_differential: 2.8,
            stableford: 36,
            ega: 11.9,
            whs: 12.1,
        }
    ]
}

window.test_player_data = player_data;