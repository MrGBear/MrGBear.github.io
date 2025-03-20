/**
 * Create a personal email text
 * @param {*} player_name The Name of the player
 * @param {*} ega_hdci The new ega value
 * @param {*} whs_hdci The new whs value
 * @returns The email text
 */
function create_mail_text(player_name, ega_hdci, whs_hdci) {
    const email = `Hallo ${player_name},

Uns liegt ein Update zu deinen Ergebnissen vor, weswegen wir das Handicap neu berechnet haben.

Dein neues Handicap nach dem EGA-System ist: ${ega_hdci},
Dein neues Handicap nach dem WHS-System ist: ${whs_hdci}

Wir wünschen dir einen angenehmen Tag und freuen uns auf deinen nächsten Besuch!

Mit freundlichen Grüßen
Dein Golf Team
`
    return email;
}

/**
 * Send an email updating them of a change in their handicap
 * @param {*} player_name The Name of the player
 * @param {*} ega_hdci The new ega value
 * @param {*} whs_hdci The new whs value
 * @param {*} recipient_email Email of the player
 */
export function send_email(player_name, ega_hdci, whs_hdci, recipient_email) {
    const subject = "Handicap Update";
    const body = create_mail_text(player_name, ega_hdci, whs_hdci);
    const mailtoLink = `mailto:${recipient_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}