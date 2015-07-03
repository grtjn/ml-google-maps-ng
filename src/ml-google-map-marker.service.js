(function () {
  'use strict';

  angular.module('ml.google-maps')
  .factory('MLGoogleMapMarkerFactory', ['GoogleMaps', MLGoogleMapMarkerFactory]);
  
  function MLGoogleMapMarkerFactory($googleMaps) {
    
    /** @constructor */
    function GoogleMapClusterMarker(bounds, map, count, icon) {
      // Now initialize all properties.
      this.bounds_ = bounds;
      this.map_ = map;
      this.count_ = count;
      this.icon_ = icon;

      // We define a property to hold the image's div. We'll
      // actually create this div upon receipt of the onAdd()
      // method so we'll leave it null for now.
      this.div_ = null;

      // Explicitly call setMap on this overlay
      this.setMap(map);

      return this;
    }

    GoogleMapClusterMarker.prototype = new $googleMaps.OverlayView();

    GoogleMapClusterMarker.prototype.onAdd = function() {
      // Note: an overlay's receipt of onAdd() indicates that
      // the map's panes are now available for attaching
      // the overlay to the map via the DOM.

      // Create the DIV and set some basic attributes.
      var div = document.createElement('div');
      div.className = 'map-cluster-icon icon' + this.icon_;

      // Create an IMG element and attach it to the DIV.
      div.innerHTML= '<span>' + this.count_ + '</span>';

      // Set the overlay's div_ property to this DIV
      this.div_ = div;

      // We add an overlay to a map via one of the map's panes.
      // We'll add this overlay to the overlayLayer pane.
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(div);
    };

    GoogleMapClusterMarker.prototype.draw = function() {
      // Size and position the overlay. We use a southwest and northeast
      // position of the overlay to peg it to the correct position and size.
      // We need to retrieve the projection from this overlay to do this.
      var overlayProjection = this.getProjection();

      // Retrieve the center coordinates of this overlay
      // in latlngs and convert them to pixels coordinates.
      var center = overlayProjection.fromLatLngToDivPixel(this.bounds_.getCenter());
      var size = 30 + (''+this.count_).length * 10;

      // Resize the image's DIV to fit the indicated dimensions.
      var div = this.div_;
      if (div) {
        div.style.left = Math.round(center.x - size / 2) + 'px';
        div.style.top = Math.round(center.y - size / 2) + 'px';
        div.style.width = size + 'px';
        div.style.height = size + 'px';
        div.style.lineHeight = size + 'px';
        div.style.backgroundSize = '100%';
      } else {
        // should never be reached??
      }
    };

    GoogleMapClusterMarker.prototype.onRemove = function() {
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };

    return {
      createMarker: function(map, box, index, icon) {
        var bounds = new $googleMaps.LatLngBounds(new $googleMaps.LatLng(box.s, box.w), new $googleMaps.LatLng(box.n, box.e));
        if (box.count === 1 && box.uri) {
          return new $googleMaps.Marker({
            position: bounds.getCenter(),
            map: map,
            title: box.uri,
            icon: '/images/p'+icon+'.png'
          });
        } else {
          return new GoogleMapClusterMarker(bounds, map, box.count, icon);
        }
      }
    };
  }
})();
