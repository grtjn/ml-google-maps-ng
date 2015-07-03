(function() {
  'use strict';

  angular.module('ml.google-maps', ['ui.map', 'ml.google-maps.tpls']);

}());

(function () {
  'use strict';

  angular.module('ml.google-maps')
  .factory('GoogleMaps', ['$window', function($window) {
    return $window.google.maps;
  }]);

})();

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
            icon: '/images/map/p'+icon+'.png'
          });
        } else {
          return new GoogleMapClusterMarker(bounds, map, box.count, icon);
        }
      }
    };
  }
})();

(function () {

  'use strict';

  angular.module('ml.google-maps')
  .filter('hasBoxes', function() {
    return function(input,facet) {
      var out = [];
      angular.forEach(input, function(facet) {
        if (facet && facet.boxes) {
          out.push(facet);
        }
      });
      return out;
    };
  })
  .directive('mlGoogleSearchMapLegend', [function () {
    return {
      restrict: 'E',
      scope: {
        // model access
        facets: '=facets'
      },
      templateUrl: '/ml-google-maps-ng/ml-google-search-map-legend.html',
      link: function($scope, $element, $attrs) {
      }
    };
  }]);
}());

/* global google */

(function () {

  'use strict';
  
  angular.module('ml.google-maps')
  .directive('mlGoogleSearchMap', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      controller: 'MLGoogleSearchMapController',
      scope: {
        // model access
        map: '=map',
        options: '=options',
        facets: '=facets',
        markers: '=markers',
        overlayOptions: '=overlayOptions',
        overlays: '=overlays',
        selections: '=selections',
        
        // parent callbacks
        parentBoundsChanged: '&boundsChanged',
        parentShowResult: '&showResult',
        parentShowContextMenu: '&showContextMenu'
      },
      templateUrl: '/ml-google-maps-ng/ml-google-search-map.html',
      link: function($scope, $element, $attrs, $controller) {
        
        // watch for model changes in parent
        
        $scope.$watch('$parent.'+$attrs.facets, function(newFacets) {
          if (newFacets) {
            $controller.repaintMap(newFacets);
          }
        });
        
        // Google Map event callbacks
        
        $scope.dragend = function() {
          // Try to keep model in sync with map
          if ($scope.options.center.lat() !== $scope.map.getCenter().lat() && $scope.options.center.lng() !== $scope.map.getCenter().lng()) {
            $scope.options.center = $scope.map.getCenter();
            $scope.parentBoundsChanged({bounds: $scope.map.getBounds()});
          }
        };
        $scope.zoomChanged = function() {
          // Try to keep model in sync with map
          if ($scope.options.zoom !== $scope.map.getZoom()) {
            $scope.options.zoom = $scope.map.getZoom();
            $scope.parentBoundsChanged({bounds: $scope.map.getBounds()});
          }
        };
        $scope.maptypeidChanged = function() {
          // Try to keep model in sync with map
          if ($scope.options.mapTypeId !== $scope.map.getMapTypeId()) {
            $scope.options.mapTypeId = $scope.map.getMapTypeId();
          }
        };
        $scope.rightclick = function () {
          if ($scope.parentShowContextMenu) {
            $scope.parentShowContextMenu();
          }
        };
        
        $scope.overlayComplete = function(overlayEvent) {
          $scope.parentBoundsChanged({bounds: overlayEvent.overlay.getBounds()});
        };
        
        // watch for map options changes in parent
        
        // Try to keep map in sync with model
        $scope.$watch('$parent.'+$attrs.options+'.center', function(newCenter) {
          if (newCenter && $scope.map) {
            // prevent endless loops, and $digest already in progress messages using timeout(,,false)..
            $timeout(function(){
              google.maps.event.trigger($scope.map, 'resize');
              $scope.map.setCenter(newCenter);
            },0,false);
          }
        });
        $scope.$watch('$parent.'+$attrs.options+'.zoom', function(newZoom) {
          if (newZoom && $scope.map) {
            // prevent endless loops, and $digest already in progress messages using timeout(,,false)..
            $timeout(function(){
              google.maps.event.trigger($scope.map, 'resize');
              $scope.map.setZoom(newZoom);
            },0,false);
          }
        });
        $scope.$watch('$parent.'+$attrs.options+'.mapTypeId', function(newMapTypeId) {
          // prevent endless loops, and $digest already in progress messages using timeout(,,false)..
          if (newMapTypeId && $scope.map) {
            $timeout(function(){
              $scope.map.setMapTypeId(newMapTypeId);
            },0,false);
          }
        });
        
        // get rid of param wrapping..
        
        $scope.showResult = function(uri) {
          return $scope.parentShowResult({uri:uri});
        };
      }
    };
  }])
  .controller('MLGoogleSearchMapController', ['MLGoogleMapMarkerFactory', '$scope', '$timeout', function(markerFactory, $scope, $timeout) {
    
    // keep a copy of original options
    var initOptions = {};
    angular.extend(initOptions, $scope.options);
    
    // private controller functions
    
    function addMapMarkers(facets) {
      // Add geo markers to map
      var facetName, facet;
      var i = 0;
      for (facetName in facets) {
        facet = facets[facetName];
      
        if (facet && facet.boxes) {
          i++;
          // No delayed execution here, this is safe..
          /* jshint loopfunc: true */
          angular.forEach(facet.boxes, function(box, index) {
            $scope.markers.push(markerFactory.createMapMarker($scope.map, box, index, i));
          });
          /* jshint loopfunc: false */
        }
      }
    }
    function clearMapMarkers() {
      if ($scope.markers) {
        // Flush current geo markers
        angular.forEach($scope.markers, function(marker, index) {
          marker.setMap(null);
        });
        $scope.markers.length = 0;
      }
    }
    
    // externally exposed controller functions
    
    this.repaintMap = function(facets) {
      (function(facets){
        // don't wait for the map to repaint..
        $timeout(function() {
          // repaint map in case someone navigated back from details to search results
          clearMapMarkers();
          if ($scope.overlays && $scope.overlays.length === 0) {
            angular.forEach($scope.overlayOptions, function(options, index) {
              var overlay = new google.maps.GroundOverlay(
                options.image,
                options.bounds);
              overlay.setMap($scope.map);
              $scope.overlays.push(overlay);
            });
          }
          addMapMarkers(facets);
          
          if (!$scope.drawingManager) {
            $scope.drawingManager = new google.maps.drawing.DrawingManager({
              //drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  /*google.maps.drawing.OverlayType.MARKER,
                  google.maps.drawing.OverlayType.CIRCLE,
                  google.maps.drawing.OverlayType.POLYGON,
                  google.maps.drawing.OverlayType.POLYLINE,*/
                  google.maps.drawing.OverlayType.RECTANGLE
                ]
              },
              markerOptions: {
                icon: 'images/beachflag.png'
              },
              circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
              }
            });
            $scope.drawingManager.setMap($scope.map);
            google.maps.event.addListener($scope.drawingManager, 'overlaycomplete', function(overlayEvent) {
              $scope.selections.push(overlayEvent.overlay);
              $scope.overlayComplete(overlayEvent);
            });
          }
        },100);
      })(facets);
    };
    
    // functions exposed to directive template
    
    $scope.openMarkerInfo = function(marker) {
      $scope.currentMarker = marker;
      $scope.currentMarkerLat = marker.getPosition().lat();
      $scope.currentMarkerLng = marker.getPosition().lng();
      $scope.myInfoWindow.open($scope.map, marker);
    };
    
    $scope.setMarkerPosition = function(marker, lat, lng) {
      marker.setPosition(new google.maps.LatLng(lat, lng));
    };
    
    // watch for broadcasts
    
    $scope.$on('ml-google-search-map.refresh', function () {
      // prevent 'digest already in progress messages' by using timeout with false
      $timeout(function() {
        initCenter();
      },0,false);
    });
    // init
    
    function initCenter() {
      if ($scope.map) {
        google.maps.event.trigger($scope.map, 'resize');
        if ($scope.options) {
          $scope.map.setCenter($scope.options.center);
        }
      }
    }
    
    (function init(){
      // the google map sometimes gets centered wrongly, fix center, and refresh (multiple attempts in case loading map is slow)..
      $timeout(function() {
        initCenter();
      },1000,false);
      $timeout(function() {
        initCenter();
      },2000,false);
      $timeout(function() {
        initCenter();
      },4000,false);
    })();
  }]);
}());

(function(module) {
try {
  module = angular.module('ml.google-maps.tpls');
} catch (e) {
  module = angular.module('ml.google-maps.tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-google-maps-ng/ml-google-search-map-legend.html',
    '<div class="map-legend"><span ng-repeat="(index, facet) in facets | hasBoxes"><span ng-class="{0: \'map-cluster-icon icon1\', 1: \'map-cluster-icon icon2\', 2: \'map-cluster-icon icon3\', 3: \'map-cluster-icon icon4\', 4: \'map-cluster-icon icon5\' }[index]"></span> <label>{{facet.label ? facet.label : facet.__key}}</label></span></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.google-maps.tpls');
} catch (e) {
  module = angular.module('ml.google-maps.tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-google-maps-ng/ml-google-search-map.html',
    '<section class="map"><div ui-map="map" ui-options="options" ui-event="{ \'map-bounds_changed\': \'boundsChanged()\', \'map-center_changed\': \'centerChanged()\', \'map-click\': \'click()\', \'map-dblclick\': \'dblclick()\', \'map-drag\': \'drag()\', \'map-dragend\': \'dragend()\', \'map-dragstart\': \'dragstart()\', \'map-heading_changed\': \'headingChanged()\', \'map-idle\': \'idle()\', \'map-maptypeid_changed\': \'maptypeidChanged()\', \'map-mousemove\': \'mousemove()\', \'map-mouseout\': \'mouseout()\', \'map-mouseover\': \'mouseover()\', \'map-projection_changed\': \'projectionChanged()\', \'map-resize\': \'resize()\', \'map-rightclick\': \'rightclick()\', \'map-tilesloaded\': \'tilesloaded()\', \'map-tilt_changed\': \'tiltChanged()\', \'map-zoom_changed\': \'zoomChanged()\' }" class="map-canvas"></div><div ng-repeat="marker in markers" ui-map-marker="marker" ui-event="{\'map-click\': \'showResult(marker.title)\'}"></div><div ui-map-info-window="myInfoWindow">Lat: <input ng-model="currentMarkerLat">, Lng: <input ng-model="currentMarkerLng"> <button ng-click="setMarkerPosition(currentMarker, currentMarkerLat, currentMarkerLng)">Update</button></div></section>');
}]);
})();
