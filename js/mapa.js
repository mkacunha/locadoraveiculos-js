var geocoder;

function initMap() {
  var markerArray = [];

  geocoder = new google.maps.Geocoder();
  // Instantiate a directions service.
  var directionsService = new google.maps.DirectionsService;

  // Create a map and center it on Manhattan.
  var map = new google.maps.Map(document.getElementById('mapa'), {
    zoom: 13,
    center: {lat: 40.771, lng: -73.974}
  });

  // Create a renderer for directions and bind it to the map.
  var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

  // Instantiate an info window to hold step text.
  var stepDisplay = new google.maps.InfoWindow;

  // Display the route between the initial start and end selections.
  calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
  // Listen to change events from the start and end lists.
  var onChangeHandler = function() {
    calculateAndDisplayRoute(
      directionsDisplay, directionsService, markerArray, stepDisplay, map);
    };

    $("#edOrigem").blur(onChangeHandler);
    $("#edDestino").blur(onChangeHandler);
  }

  function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
      origin: document.getElementById('edOrigem').value,
      destination: document.getElementById('edDestino').value,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        showSteps(response, markerArray, stepDisplay, map);
      }
    });
  }

  function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    var valorKm = UTIL.formatarValorMonetario(myRoute.distance.value / 1000, 2, ',', '.');
    $('#edQuantidadeKm').val(valorKm);

    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      attachInstructionText(
        stepDisplay, marker, myRoute.steps[i].instructions, map);
      }
    }

    function attachInstructionText(stepDisplay, marker, text, map) {
      google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
      });
    }

    $(document).ready(function () {
      initMap();

      $("#edOrigem").autocomplete({
        source: function (request, response) {
          geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
            response($.map(results, function (item) {
              return {
                label: item.formatted_address,
                value: item.formatted_address,
                latitude: item.geometry.location.lat(),
                longitude: item.geometry.location.lng()
              }
            }));
          })
        },
        select: function (event, ui) {
          $("#edOrigemLatitude").val(ui.item.latitude);
          $("#edOrigemLongitude").val(ui.item.longitude);
          var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        /*  marker.setPosition(location);
          map.setCenter(location);
          map.setZoom(16); */
        }
      });

      $("#edDestino").autocomplete({
        source: function (request, response) {
          geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
            response($.map(results, function (item) {
              return {
                label: item.formatted_address,
                value: item.formatted_address,
                latitude: item.geometry.location.lat(),
                longitude: item.geometry.location.lng()
              }
            }));
          })
        },
        select: function (event, ui) {
          $("#edDestinoLatitude").val(ui.item.latitude);
          $("#edDestinoLongitude").val(ui.item.longitude);
          var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        /*  marker.setPosition(location);
          map.setCenter(location);
          map.setZoom(16); */
        }
      });

    });
