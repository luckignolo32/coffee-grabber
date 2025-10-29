# Coffee Grabber
So, you want a coffee, and cafes are usually quite expensive. What's the other best option for you? Of course, coffee vending machines! And this very straightforward application will let you find a lot of coffee machines everywhere in the world.

## Under the hook
The application is a very simple Python server with a JavaScript frontend using [Leaflet](https://github.com/Leaflet/Leaflet). The backend uses [OSMPythonTools](https://github.com/mocnik-science/osm-python-tools) to run an overpass query to find coffee vending machines in a 2.5 km radius starting from a marker placed down by the user. The service, at the moment, does not implement a search box.

## Run Locally (Development version!)
The service can be run locally with very few and easy steps:
1) Clone this repo and `cd` into it
2) Run `source backend/venv/bin/activate` if you're on macOS/Linux or `backend\venv\Scripts\activate` if you're on Windows to activate the virtual environment
3) Simply run `python backend/src/coffeeGrabber/main.py` on macOS/Linux or `python backend\src\coffeeGrabber\main.py` on Windows.
4) Open your browser and go to `127.0.0.1:5000`. Enjoy!
5) Remember to deactivate your virtual environment at the end with `deactivate`. 


