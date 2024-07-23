// Initialize the map
var map = L.map('map').setView([43.237263, -0.252481], 17);

// Add Google Satellite tiles
L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    maxZoom: 20
}).addTo(map);

// Function to add circles to the map
function addCircles(data) {
    const today = new Date().toISOString().split('T')[0];
    const repassesToday = [];

    data.forEach(function(row) {
        var lat = parseFloat(row.lat);
        var lon = parseFloat(row.lon);
        var id = row.id;
        var numero = row.numero;
        var nom_voie = row.nom_voie;

        if (!isNaN(lat) && !isNaN(lon)) {
            var { state, date } = getPointState(id);
            var circle = L.circle([lat, lon], {
                color: stateColors[state],
                fillColor: stateColors[state],
                fillOpacity: 0.8,
                radius: 6 // Adjust the radius as needed to make it small
            }).addTo(map);

            // Add popup with numero and nom_voie
            circle.bindPopup(createStateButtons(id, circle, numero, nom_voie));

            // Check for repasses scheduled for today
            if (state === states.REPASSE && date && date.startsWith(today)) {
                repassesToday.push({ address: `${numero} ${nom_voie}`, date });
            }
        }
    });

    // Display the menu if there are repasses today
    if (repassesToday.length > 0) {
        const menu = document.getElementById('menu');
        const menuTitle = document.createElement('h3');
        menuTitle.textContent = 'Repasses prévues aujourd\'hui';
        menu.appendChild(menuTitle);

        const list = document.createElement('ul');
        repassesToday.forEach(repass => {
            const listItem = document.createElement('li');
            listItem.textContent = `${repass.address} - ${new Date(repass.date).toLocaleString()}`;
            list.appendChild(listItem);
        });

        menu.appendChild(list);
    }
}

// Load CSV file and parse it
Papa.parse('csv/AAngais.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        addCircles(results.data);
    }
});
