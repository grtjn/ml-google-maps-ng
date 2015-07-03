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
