import { backendCalc } from './datahandler.js';


document.getElementById("calculateHandicap").addEventListener("click", function () {
  document.getElementById("mermaidContainer").classList.remove("hidden")

  const player_name = document.getElementById("player_name").value;  // Player name
  const course_name = document.getElementById("course_name").value;  // Course name
  const course_rating = parseFloat(document.getElementById("course_rating").value);  // Course rating
  const slope_rating = parseInt(document.getElementById("slope_rating").value);  // Slope rating
  const ppc = parseInt(document.getElementById("ppc").value);  // PPC
  const handicap_index = document.getElementById("handycap_index").value ? parseFloat(document.getElementById("handycap_index").value) : null;  // Handicap index
  const date = document.getElementById("date").value;  // Date

  const numberOfHoles = parseInt(document.getElementById("number_holes").value);

  const tableRows = document.querySelectorAll("#scoreTable tbody tr");

  const holes = [];

  tableRows.forEach((row, index) => {
    const par = row.querySelector('input[name="par[]"]').value;
    const gbe = row.querySelector('input[name="gbe[]"]').value;
    const hdc = row.querySelector('input[name="hdc[]"]').value;

    if (par && gbe) {
      holes.push({
        pos: index + 1, // Loch Nummer
        par: parseInt(par),
        gbe: parseInt(gbe),
        hdc: parseInt(hdc)
      });
    }
  });

  const dataToCalc =
      {
        course_name: course_name,
        course_rating: course_rating,
        slope_rating: slope_rating,
        ppc: ppc,
        handicap_index: handicap_index,
        date: date,
        holes: holes
      }


  console.log(dataToCalc);

  backendCalc.addGame(dataToCalc);

  console.log("games:" + JSON.stringify(backendCalc.getGames()));
})