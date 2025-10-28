/* Made by luckignolo32, 2025 */
/* This is where all map functionalities are implemented. See each section for details. */

/* 
 * During initialization, some stuff happens:
 * - a global variable called referencePosition is initialized; this will be the variable used to look for the machines from
 * - a map gets initialized
 * - three layers are initialized: map, markers and machines
 * - position is (if possible) located, and the map shows the place the user is in
  */

// -------------------- Initialization  -----------------------------

var referencePos = [41.90539897953375, 12.51698306704468];
var map = L.map('map', { 
    doubleClickZoom: false 
}).setView(referencePos, 10);

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
  referencePos = e.latlng;
  if (markerGroup.getLayers().length > 0)
    markerGroup.clearLayers();

  L.marker(referencePos).addTo(markerGroup);        
  fetchCoffeeMachines();
}


// --------------------- Backend Interaction ------------------------

/* Retrieves the data from backend and then loops to make them visible */
async function fetchCoffeeMachines() {
  machinesGroup.clearLayers();

  try {
    const response = await fetch(`/api/coffee-machines?lat=${referencePos[0]}&lon=${referencePos[1]}`);
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
