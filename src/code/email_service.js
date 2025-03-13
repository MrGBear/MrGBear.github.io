function create_mail_text(player_name, ega_hdci, whs_hdci) {
    const email = `
    Hallo ${player_name},

    Uns liegt ein Update zu ihrem Ergebnissen vor, weswegen wir das Handicap neu berechnet haben.

    Ihr neues Handicap nach dem EGA-System ist: ${ega_hdci},
    Ihr neues Handicap nach dem WHS-System ist: ${whs_hdci}

    Wir wünschen dir einen angenehmen Tag und freuen uns auf deinen nächsten Besuch!
    
    Mit freundlichen Grüßen
    Ihr Golfteam
    `
    return email;
}