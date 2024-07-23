// Initialize the map without zoom controls
var map = L.map('map', {
    zoomControl: false
}).setView([43.237263, -0.252481], 17);

// Add Google Satellite tiles
L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    maxZoom: 20
}).addTo(map);

// Function to add circles to the map
function addCircles(data) {
    const today = new Date().toISOString().split('T')[0];
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    const repassesToday = [];
    const repasNext7Days = [];

    data.forEach(function(row) {
        var lat = parseFloat(row.lat);
        var lon = parseFloat(row.lon);
        var id = row.id;
        var numero = row.numero;
        var rep = row.rep;
        var nom_voie = row.nom_voie;
        var state = row.state;
        var date = row.date;
        var amount = row.amount;
        var payment_method = row.payment_method;
        var repas = row.repas;

        if (!isNaN(lat) && !isNaN(lon)) {
            var circle = L.circle([lat, lon], {
                color: stateColors[state],
                fillColor: stateColors[state],
                fillOpacity: 0.8,
                radius: 6 // Adjust the radius as needed to make it small
            }).addTo(map);

            // Add popup with numero, rep, and nom_voie
            circle.bindPopup(createStateButtons(id, circle, numero, rep, nom_voie));

            // Check for repasses scheduled for today
            if (state === states.REPASSE && date) {
                if (date.startsWith(today)) {
                    repassesToday.push({ address: `${numero} ${rep ? rep + ' ' : ''}${nom_voie}`, date });
                } else if (repas && new Date(date) <= weekLater) {
                    repasNext7Days.push({ address: `${numero} ${rep ? rep + ' ' : ''}${nom_voie}`, date });
                }
            }
        }
    });

    // Display the menu if there are repasses or repas
    const menu = document.getElementById('menu');
    menu.innerHTML = '';  // Clear any existing content

    if (repasNext7Days.length > 0) {
        const repasTitle = document.createElement('h3');
        repasTitle.textContent = 'Repas prévus dans les 7 prochains jours';
        menu.appendChild(repasTitle);

        const repasList = document.createElement('ul');
        repasNext7Days.forEach(repas => {
            const listItem = document.createElement('li');
            listItem.textContent = `${repas.address} - ${new Date(repas.date).toLocaleString()}`;
            repasList.appendChild(listItem);
        });

        menu.appendChild(repasList);
    }

    if (repassesToday.length > 0) {
        const repasseTitle = document.createElement('h3');
        repasseTitle.textContent = 'Repasses prévues aujourd\'hui';
        menu.appendChild(repasseTitle);

        const repasseList = document.createElement('ul');
        repassesToday.forEach(repass => {
            const listItem = document.createElement('li');
            listItem.textContent = `${repass.address} - ${new Date(repass.date).toLocaleString()}`;
            repasseList.appendChild(listItem);
        });

        menu.appendChild(repasseList);
    }
}

// Fetch points from the server and add them to the map
fetch('php/get_points.php')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Vérifiez les données récupérées
        addCircles(data);
    })
    .catch(error => console.error('Error fetching points:', error));
