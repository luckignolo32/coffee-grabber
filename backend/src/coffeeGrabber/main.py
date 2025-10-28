from flask import Flask, jsonify, send_from_directory

# Server
app = Flask(__name__, static_folder='../../../frontend', static_url_path='')

# API endpoint: function called by frontend
@app.route('/api/coffee-machines')
def get_coffee_machines():
    # TODO: Use OSMPythonTools here to find actual coffee machines
    # dummy data to test 
    dummy_data = [
        {"name": "Machine 1", "lat": 51.505, "lon": -0.09},
        {"name": "Machine 2", "lat": 51.51, "lon": -0.1},
        {"name": "Machine 3", "lat": 51.50, "lon": -0.08}
    ]
    return jsonify(dummy_data) 


# --- Static File Serving: tell Flask to send index.html whenever someone visits the page ---
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run(debug=True) # debug=True reloads the server on changes
