import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });

const xLabels = [1];

const values = [20];

function writeChart(){
    const chartCode = ' xychart-beta\n'
        + `    x-axis [${xLabels.join(",")}]
`
        + '    y-axis "Handicap" 0 --> 70\n'
        + `    bar [${values.join(",")}]
`
        + `    line [${values.join(",")}]`;

    document.getElementById("mermaidContainerWHS").innerHTML = chartCode;
    document.getElementById("mermaidContainerEGA").innerHTML = chartCode;
}

writeChart();


function addValueToChart(xLabel, value){
    xLabels.push(xLabel);
    values.push(value);
    console.log(xLabels);
    console.log(values);
    writeChart();
}
