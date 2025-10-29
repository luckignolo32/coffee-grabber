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

var coffeeIcon = L.icon({
    iconUrl: 'images/coffee-icon.png',

    iconSize:     [70, 75], 
    shadowSize:   [50, 64], 
    iconAnchor:   [38, 84], 
    shadowAnchor: [4, 62],  
    popupAnchor:  [-3, -76] 
});


var markerGroup = L.layerGroup().addTo(map);
var machinesGroup = L.layerGroup().addTo(map);

map.locate({ setView: true, maxZoom: 15 });



// --------------- Event Listener functionalities -------------------

function onLocationError(e) {
  alert(e.message);
}

/* On double click, it adds a marker to the map */
function onDoubleClick(e) {
  referencePos = [e.latlng.lat, e.latlng.lng];
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
      L.marker([machine.lat, machine.lon], {icon: coffeeIcon})
        .addTo(machinesGroup)
        .bindPopup(async (layer) => {

          let lat = layer.getLatLng().lat;
          let lon = layer.getLatLng().lng;

          let popupContent = `<b>${machine.name}</b><br>`;
          if (machine.tags && machine.tags['payment:cash']) {
            popupContent += `Cash: ${machine.tags['payment:cash']}<br>`;
          }
          popupContent += "<hr><em>Fetching address...</em>";

          try {
            const addrResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18`);
            const addrData = await addrResponse.json();

            let finalContent = `<b>${machine.name}</b><br>`;

            if (addrData && addrData.display_name) {
              finalContent += `${addrData.display_name}<br>`;
            } else {
              finalContent += `Address not found.<br>`;
            }

            if (machine.tags && machine.tags['payment:cash']) {
              finalContent += `Cash: ${machine.tags['payment:cash']}<br>`;
            }

            finalContent += `<a href="geo:${lat},${lon}" target="_blank">Open in Maps</a><br>`;

            layer.setPopupContent(finalContent);

          } catch (err) {
            layer.setPopupContent(`<b>${machine.name}</b><br>Error fetching address.`);
          }

          return popupContent;
        });
    });

  } catch (error) {
    console.error('Error fetching coffee machines:', error);
  }
}


fetchCoffeeMachines();

// Event Listeners
map.on('locationerror', onLocationError);
map.on('dblclick', onDoubleClick);
