// Set up OpenLayers map
const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(), // OpenStreetMap base layer
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([74.3587, 31.5204]), // Center on Lahore
      zoom: 12,
    }),
  });

// Popup overlay
const popupElement = document.getElementById('popup');
const popup = new ol.Overlay({
    element: popupElement,
    positioning: 'bottom-center',
  });
  map.addOverlay(popup);

  // Function to load and parse CSV file
function handleFileSelect(event) {

    const file = event.target.files[0];

    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const csvData = e.target.result;
        parseCSV(csvData);
      };
  
      reader.readAsText(file);
    } else {
      alert('Please select a valid CSV file.');
    }
  }
  
  // Function to parse CSV and plot points on the map
  function parseCSV(csvData) {
    const rows = csvData.split('\n');
    let extent = [Infinity, Infinity, -Infinity, -Infinity]; // Initialize extent as extreme values

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      const [placeName, lat, lon] = row.split(',');
  
      if (placeName && lat && lon) {
        const coordinate = ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]);

        // Update the extent based on this coordinate
      extent[0] = Math.min(extent[0], coordinate[0]); // West (min x)
      extent[1] = Math.min(extent[1], coordinate[1]); // South (min y)
      extent[2] = Math.max(extent[2], coordinate[0]); // East (max x)
      extent[3] = Math.max(extent[3], coordinate[1]); // North (max y)
  
        // Create a marker (point)
        const marker = new ol.Feature({
          geometry: new ol.geom.Point(coordinate),
          name: placeName,
        });
  
        // Create a vector source and layer
        const vectorSource = new ol.source.Vector({
          features: [marker],
        });
        const vectorLayer = new ol.layer.Vector({
          source: vectorSource,
        });
        map.addLayer(vectorLayer);
  
        // Add click event to show popup
        marker.setStyle(
          new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10,
              fill: new ol.style.Fill({ color: 'red' }),
              stroke: new ol.style.Stroke({ color: 'white', width: 1 }),
            }),
          })
        );
  
        map.on('singleclick', (evt) => {
          const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
          if (feature) {
            const coords = feature.getGeometry().getCoordinates();
            popup.setPosition(coords);
            popup.getElement().innerHTML = `<div><strong>${feature.get('name')}</strong></div>`;
          } else {
            popup.setPosition(undefined);
          }
        });
      }
    });
    // After processing all the points, update the map view to fit the extent
  map.getView().fit(extent, { size: map.getSize(), padding: [50, 50, 50, 50] });
  }
  

  // Attach event listener to the file input for CSV file selection
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileSelect);
