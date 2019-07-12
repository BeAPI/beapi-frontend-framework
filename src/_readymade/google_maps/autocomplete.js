import $ from 'jquery'

class GoogleAutocomplete {
  constructor(opts, limits, gMapsApiKey) {
    // le.log('GoogleAutocomplete')
    this.google_depart = $('.google_depart input').get(0)
    this.google_arrivee = $('.google_arrivee input').get(0)
    this.input_departure_city_cover = document.getElementById('input-departure-city-cover')
    this.input_arrival_city_cover = document.getElementById('input-arrival-city-cover')
    this.componentForm = opts
    this.apikey = gMapsApiKey
    this.options = limits
    this.fields = ['address_components', 'geometry']
    // console.log(this)
  }

  init() {
    let self = this
    this.autocompleteDepart = new google.maps.places.Autocomplete(this.google_depart, this.options)
    this.autocompleteDepart.addListener('place_changed', this.fillInAddressDepart.bind(this))
    this.autocompleteDepart.setFields(this.fields)
    this.autocompleteArrivee = new google.maps.places.Autocomplete(this.google_arrivee, this.options)
    this.autocompleteArrivee.addListener('place_changed', this.fillInAddressArrivee.bind(this))
    this.autocompleteArrivee.setFields(this.fields)
    this.autocompleteCoverDepart = new google.maps.places.Autocomplete(this.input_departure_city_cover, this.options)
    this.autocompleteCoverDepart.addListener('place_changed', this.fillInAddressDepartCover.bind(this))
    this.autocompleteCoverDepart.setFields(this.fields)
    this.autocompleteCoverArrivee = new google.maps.places.Autocomplete(this.input_arrival_city_cover, this.options)
    this.autocompleteCoverArrivee.addListener('place_changed', this.fillInAddressArriveeCover.bind(this))
    this.autocompleteCoverArrivee.setFields(this.fields)
    google.maps.event.addListener(self.autocompleteDepart, 'place_changed', function() {
      // console.log('autocompleteDepart')
      self.calculDurationDistance()
    })
    google.maps.event.addListener(self.autocompleteArrivee, 'place_changed', function() {
      // console.log('autocompleteArrivee')
      self.calculDurationDistance()
    })

    $('#btn-display-form-desktop').on('click', function() {
      self.calculDurationDistance()
    })
  }
  calculDurationDistance() {
    let directionsService = new google.maps.DirectionsService()

    let origninCall = $('.google_depart input').val()
    let destinationCall = $('.google_arrivee input').val()

    if (origninCall !== '' && destinationCall !== '') {
      // console.log('go routing')
      directionsService.route(
        {
          origin: origninCall,
          destination: destinationCall,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            response.routes[0].legs[0].duration.value =
              response.routes[0].legs[0].duration.value + (response.routes[0].legs[0].duration.value / 100) * 30
            let duree = response.routes[0].legs[0].duration.value
            let heures = parseInt(duree / 3600)
            let minutes = parseInt((duree % 3600) / 60)
            // console.log(duree, heures, minutes)
            let txtHeure = heures > 1 ? ' heures ' : ' heure '
            let txtminute = minutes > 1 ? ' minutes ' : ' minute '
            let timeTravel30pourc =
              heures <= 0 ? `${minutes} ${txtminute}` : `${heures} ${txtHeure} ${minutes} ${txtminute}`
            // console.log(timeTravel30pourc)
            $('.form-distance-travel input').val(response.routes[0].legs[0].distance.text)
            $('.form-duration-travel input').val(timeTravel30pourc)
            // console.log('done', timeTravel30pourc)
          } else {
            // console.log('error gmaps', status, origninCall, destinationCall)
          }
        }
      )
    } else {
      // console.log('nodata', origninCall, destinationCall)
    }
  }

  fillInAddressDepart() {
    let inputDepart = this.componentForm
    // console.table(inputDepart)

    let place = this.autocompleteDepart.getPlace()

    for (let i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] === 'country') {
        inputDepart.short_name = place.address_components[i].short_name
      }

      let addressType = place.address_components[i].types[0]
      let val = place.address_components[i].long_name

      inputDepart[addressType] = val
    }

    inputDepart.lat = place.geometry.location.lat()
    inputDepart.lng = place.geometry.location.lng()

    $('.ville_depart input').val(inputDepart.locality)
    $('.lieu_depart input').val(inputDepart.route + ' ' + inputDepart.street_number)
    $('.pays_depart input').val(inputDepart.country)
    // $('.coord_lat_start input').val(inputDepart.lat)
    // $('.coord_lon_start input').val(inputDepart.lng)
    // $('.country_tag_start input').val(inputDepart.short_name)
  }

  fillInAddressArrivee() {
    let inputArrivee = this.componentForm

    let place = this.autocompleteArrivee.getPlace()

    for (let i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] === 'country') {
        inputArrivee.short_name = place.address_components[i].short_name
      }

      let addressType = place.address_components[i].types[0]
      let val = place.address_components[i].long_name

      inputArrivee[addressType] = val
    }

    inputArrivee.lat = place.geometry.location.lat()
    inputArrivee.lng = place.geometry.location.lng()

    $('.ville_arrivee input').val(inputArrivee.locality)
    $('.lieu_arrivee input').val(inputArrivee.route + ' ' + inputArrivee.street_number)
    $('.pays_arrivee input').val(inputArrivee.country)
    // $('.coord_lat_arrived input').val(inputArrivee.lat)
    // $('.coord_lon_arrived input').val(inputArrivee.lng)
    // $('.country_tag_arrived input').val(inputArrivee.short_name)
  }

  fillInAddressDepartCover() {
    let inputDepartCover = this.componentForm
    // console.log('2', this.autocompleteCoverDepart)

    let place = this.autocompleteCoverDepart.getPlace()

    for (let i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] === 'country') {
        inputDepartCover.short_name = place.address_components[i].short_name
      }

      let addressType = place.address_components[i].types[0]
      let val = place.address_components[i].long_name

      inputDepartCover[addressType] = val
    }

    inputDepartCover.lat = place.geometry.location.lat()
    inputDepartCover.lng = place.geometry.location.lng()

    $('.google_depart input').val($('#input-departure-city-cover').val())
    $('.ville_depart input').val(inputDepartCover.locality)
    $('.lieu_depart input').val(inputDepartCover.route + ' ' + inputDepartCover.street_number)
    $('.pays_depart input').val(inputDepartCover.country)
    // $('.coord_lat_start input').val(inputDepartCover.lat)
    // $('.coord_lon_start input').val(inputDepartCover.lng)
    // $('.country_tag_start input').val(inputDepartCover.short_name)
  }

  fillInAddressArriveeCover() {
    let inputArriveeCover = this.componentForm

    let place = this.autocompleteCoverArrivee.getPlace()

    for (let i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] === 'country') {
        inputArriveeCover.short_name = place.address_components[i].short_name
      }

      let addressType = place.address_components[i].types[0]
      let val = place.address_components[i].long_name

      inputArriveeCover[addressType] = val
    }

    inputArriveeCover.lat = place.geometry.location.lat()
    inputArriveeCover.lng = place.geometry.location.lng()

    $('.google_arrivee input').val($('#input-arrival-city-cover').val())
    $('.ville_arrivee input').val(inputArriveeCover.locality)
    $('.lieu_arrivee input').val(inputArriveeCover.route + ' ' + inputArriveeCover.street_number)
    $('.pays_arrivee input').val(inputArriveeCover.country)
    // $('.coord_lat_arrived input').val(inputArriveeCover.lat)
    // $('.coord_lon_arrived input').val(inputArriveeCover.lng)
    // $('.country_tag_arrived input').val(inputArriveeCover.short_name)
  }

  initLocation() {
    const self = this

    // location user
    $('#location').on('click', function(e) {
      e.preventDefault()
      if (navigator.geolocation) {
        $('#input-departure-city-cover').attr('placeholder', 'Localisation en cours ...')
        navigator.geolocation.getCurrentPosition(function(position) {
          let latitude = position.coords.latitude
          let longitude = position.coords.longitude
          // console.log(latitude, longitude)
          let inputDepart = self.componentForm
          $.get(
            'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
              latitude +
              ',' +
              longitude +
              '&key=' +
              self.apikey,
            function(data) {
              for (var i = 0; i < data['results'][0]['address_components'].length; i++) {
                let addressType = data['results'][0]['address_components'][i].types[0]
                let val = data['results'][0]['address_components'][i].long_name
                inputDepart[addressType] = val
              }

              $('#input-departure-city-cover').val(
                inputDepart.route +
                  ' ' +
                  inputDepart.street_number +
                  ', ' +
                  inputDepart.postal_code +
                  ' ' +
                  inputDepart.locality +
                  ', ' +
                  inputDepart.country
              )
              $('.google_depart input').val(
                inputDepart.route +
                  ' ' +
                  inputDepart.street_number +
                  ', ' +
                  inputDepart.postal_code +
                  ' ' +
                  inputDepart.locality +
                  ', ' +
                  inputDepart.country
              )

              if (inputDepart.postal_code !== '') {
                inputDepart.postal_code = ' (' + inputDepart.postal_code + ')'
              }

              $('.ville_depart input').val(inputDepart.locality + inputDepart.postal_code)
              $('.lieu_depart input').val(inputDepart.route + ' ' + inputDepart.street_number)
              $('.pays_depart input').val(inputDepart.country)
            }
          )
        })
      }
    })
  }
}

// export default GoogleAutocomplete

class GoogleMapResult {
  constructor(id, start, end) {
    this.id = document.getElementById(id)
    this.start = document.getElementById(start).textContent
    this.end = document.getElementById(end).textContent
  }

  init() {
    // console.log('result map init', this.start, this.end, this.id)
    var directionsService = new google.maps.DirectionsService()
    var directionsDisplay = new google.maps.DirectionsRenderer()
    this.map = new google.maps.Map(this.id, {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    })
    directionsDisplay.setMap(this.map)

    directionsService.route(
      {
        origin: this.start,
        destination: this.end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response)
        } else {
          window.alert("L'itinéraire demandé a échoué car " + status)
        }
      }
    )
  }
}
const googleDefined = callback =>
  typeof google !== 'undefined' ? callback() : setTimeout(() => googleDefined(callback), 100)

googleDefined(() => {
  // console.log('init google map api')
  const componentForm = {
    street_number: '',
    route: '',
    locality: '',
    country: '',
    short_name: '',
    lat: '',
    lng: '',
  }
  // max 5 country codes
  const limits = {
    bounds: {
      north: 70,
      south: 35,
      west: -12,
      east: 43,
    },
    strictBounds: true,
    types: ['geocode'],
  }

  const gMapsApiKey = 'AIzaSyDA0_NJhoBxzykuohjRvzDGNZyeD3cK-RI'
  if (document.getElementsByClassName('hero').length > 0) {
    const googleautocomplete = new GoogleAutocomplete(componentForm, limits, gMapsApiKey)
    googleautocomplete.init()
    googleautocomplete.initLocation()
  }
  // console.log(document.getElementById('summary-map'))
  if (document.getElementById('summary-map')) {
    // console.log('init summary map')
    const GoogleMapResults = new GoogleMapResult('summary-map', 'summary-start', 'summary-end')
    GoogleMapResults.init()
  }
})
