from flask import Flask, jsonify, send_from_directory, request
from OSMPythonTools.overpass import Overpass

# Server
app = Flask(__name__, static_folder='../../../frontend', static_url_path='')
overpass = Overpass()

# API endpoint: function called by frontend
@app.route('/api/coffee-machines')
def get_coffee_machines():
    lat = request.args.get('lat', default=None, type=float)
    lon = request.args.get('lon', default=None, type=float)
    radius = 2500 # To be customized in the future 

    if lat is None or lon is None:
        return jsonify({"error": "Missing lat/lon parameters"}), 400

    lat = round(lat, 6)
    lon = round(lon, 6)

    print(f"Backend received request for machines near: lat={lat}, lon={lon}")

    overpass_query = f"""
    (
      node["amenity"="vending_machine"]["vending"="coffee"](around:{radius},{lat},{lon});
      way["amenity"="vending_machine"]["vending"="coffee"](around:{radius},{lat},{lon});
      relation["amenity"="vending_machine"]["vending"="coffee"](around:{radius},{lat},{lon});
    );
    out body;
    >;
    out skel qt;
    """

    try:
        result = overpass.query(overpass_query, timeout=25)
        
        machines_list = []
        assert result is not None 

        for element in result.elements():
            print(element.tags())
            # Get element name from tags, default to "Coffee Machine"
            name = element.tag('name') or "Coffee Machine"

            
            # Get coordinates
            if element.type() == 'node':
                machines_list.append({
                    "name": name,
                    "lat": element.lat(),
                    "lon": element.lon()
                })
            elif element.type() in ['way', 'relation']:
                # For ways/relations, use the center coordinates
                machines_list.append({
                    "name": name,
                    "lat": element.centerLat(),
                    "lon": element.centerLon()
                })

        print(f"Found {len(machines_list)} machines.")
        return jsonify(machines_list)

    except Exception as e:
        print(f"Overpass query failed: {e}")
        return jsonify({"error": "Failed to query OpenStreetMap"}), 500
    
# -------------------------------------------------------------------


# --- Static File Serving: tell Flask to send index.html whenever someone visits the page ---
@app.route('/')
def serve_index():
    assert app.static_folder is not None
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run(debug=True) # debug=True reloads the server on changes
