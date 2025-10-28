/* Made by luckignolo32, 2025 */
/* This is where all map functionalities are implemented. See each section for details. */

/* 
 * During initialization, some stuff happens:
 * - a map gets initialized
 * - three layers are initialized: map, markers and machines
 * - position is (if possible) located, and the map shows the place the user is in
  */

// -------------------- Initialization  -----------------------------

var map = L.map('map', { 
    doubleClickZoom: false 
}).setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var markerGroup = L.layerGroup().addTo(map);
var machinesGroup = L.layerGroup().addTo(map);

map.locate({ setView: true, maxZoom: 15 });



// --------------- Event Listener functionalities -------------------

function onLocationError(e) {
  alert(e.message);
}

/* On double click, it adds a marker to the map */
function onDoubleClick(e) {
  let position = e.latlng;
  L.marker(position).addTo(markerGroup);        
}


// --------------------- Backend Interaction ------------------------

/* Retrieves the data from backend and then loops to make them visible */
async function fetchCoffeeMachines() {
  try {
    const response = await fetch('/api/coffee-machines');
    const machines = await response.json();
    machines.forEach(machine => {
      L.marker([machine.lat, machine.lon])
        .addTo(machinesGroup)
        .bindPopup(machine.name);
    });

  } catch (error) {
    console.error('Error fetching coffee machines:', error);
  }
}


fetchCoffeeMachines();

// Event Listeners
map.on('locationerror', onLocationError);
map.on('dblclick', onDoubleClick);
