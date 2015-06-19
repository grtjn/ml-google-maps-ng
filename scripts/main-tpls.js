(function(module) {
try {
  module = angular.module('mlGoogleMapsDemo.Tpls');
} catch (e) {
  module = angular.module('mlGoogleMapsDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/home.html',
    '<h1 class="page-header" itemprop="name">Google Maps for MarkLogic</h1><div class="home row"><ml-search-map map="model.searchMap.map" options="model.searchMap.options" facets="model.search.facets" markers="model.searchMap.markers" bounds-changed="boundsChanged(bounds)" show-result="showResult(uri)" show-context-menu="resetMap()" selections="model.searchMap.selections"></ml-search-map><ml-search-map-legend facets="model.search.facets"></ml-search-map-legend><div style="display:none">{{model.search}}</div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mlGoogleMapsDemo.Tpls');
} catch (e) {
  module = angular.module('mlGoogleMapsDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quickstart.html',
    '<h1 class="page-header">Quickstart</h1><div class="row"><div class="col-md-12"><p>To start using Google Maps for MarkLogic, follow these simple steps to get started. Once you\'re up and running, visit the <a ui-sref="api">API documentation</a> to learn how to get the most out of it.</p><ol class="steps"><li><p>Download <a href="https://raw.github.com/grtjn/ml-google-maps-ng/master/dist/ml-google-maps-ng.js">ml-google-maps-ng.js</a> (<a href="https://raw.github.com/grtjn/ml-google-maps-ng/master/dist/ml-google-maps-ng.min.js">minified version</a>) and put it with your other scripts. Alternatively, you can use Bower to install it automatically:</p><div hljs="" language="bash">bower install [-save] ml-google-maps-ng</div><p>If not using Bower, you\'ll also need to fetch <a href="http://lodash.com/" rel="external">lodash.js</a>, and <a href="http://github.com/angular-ui/angular-google-maps" rel="external">angular-google-maps.js</a> yourself.</p></li><li><p>Load lodash.js, angular-google-maps.js, and ml-google-maps-ng.js into your HTML page:</p><div hljs="" language="html" source="\'<script src=\\\'/path/to/lodash[.min].js\\\'></script>\\n<script src=\\\'/path/to/angular-google-maps[.min].js\\\'></script>\\n<script src=\\\'/path/to/ml-google-maps-ng[.min].js\\\'></script>\'"></div></li><li><p>Include the Google Maps API v3, via one of two ways:</p><ul><li><p><a href="#!/api#GoogleMapApi">Google Maps SDK Async Loader</a> <span class="badge badge-info">New in v2.0.0</span></p><p>This is the <span class="label label-success">RECOMMENDED</span> way, as it tries to guarantee that Google Maps is ready prior to running any Google dependencies.</p></li><li><p>Directly load into your HTML page. Example:</p><div hljs="" language="html" source="\'<script src=\\\'//maps.googleapis.com/maps/api/js?sensor=false\\\'></script>\'"></div><p class="muted">Note: If you go down this route, ensure that it is loaded prior to angular-google-maps.js!</p></li></ul><strong>Serving Google Maps in China</strong><p>It is a state demand that all online map providers must use an obscured coordinate system called GCJ-02 (aka Coordinates on Mars). GCJ-02 is WSG-84 based, but added offsets to both latitude and longitude.</p><p>If you display a marker from GCJ-02 coordinates on a GCJ-02 map, the place will be marked correctly.<br>However the offsets can result in a less-than-100 up to 700 meter error from the actual location if you place a GCJ-02 marker on a WSG-84 map and vice versa.</p><p>There is an <a href="https://github.com/googollee/eviltransform" target="_blank">open-source project</a> that can provide approximate translation between GCJ-02 and WSG-84.</p><p>Google also submits to this regulation. They serve this modified system at maps.google.cn.<br>Specify a <code>china</code> flag when you load the Google Maps API using the GoogleMapsApi Loader like so:<br><div hljs="" language="js">angular.module(\'myApplicationModule\', [\'ml-google-maps-ng\']).config( [\'uiGmapGoogleMapApiProvider\', function(GoogleMapApiProviders) { GoogleMapApiProvider.configure({ china: true }); }] );</div>Alternatively if you manually load the Google Maps API, replace <code>//maps.googleapis.com/maps/api/js</code> with <code>http://maps.google.cn/maps/api/js</code>.</p></li><li><p>Make your application module depend on the <code>ml-google-maps-ng</code> module:</p><div hljs="" language="js">angular.module(\'myApplicationModule\', [\'ml-google-maps-ng\']);</div></li><li><p>Add a <code>map</code> object to your scope like so:</p><div hljs="" language="js">$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };</div><p class="muted">Note: this is the very minimum set of properties required for the map to work. See the <a ui-sref="api">API documentation</a> for the full list of supported properties.</p></li><li><p>Add a <code>&lt;ui-gmap-google-map&gt;</code> element in your template like so:</p><div hljs="" language="html" source="\'<ui-gmap-google-map center=\\\'map.center\\\' zoom=\\\'map.zoom\\\'></ui-gmap-google-map>\'"></div></li><li><p>Specify an height via CSS for the map container:</p><div hljs="" language="css">.angular-google-map-container { height: 400px; }</div></li></ol></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mlGoogleMapsDemo.Tpls');
} catch (e) {
  module = angular.module('mlGoogleMapsDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-google-maps-ng/ml-search-map-dir.html',
    '<section class="map"><div ui-map="map" ui-options="options" ui-event="{ \'map-bounds_changed\': \'boundsChanged()\', \'map-center_changed\': \'centerChanged()\', \'map-click\': \'click()\', \'map-dblclick\': \'dblclick()\', \'map-drag\': \'drag()\', \'map-dragend\': \'dragend()\', \'map-dragstart\': \'dragstart()\', \'map-heading_changed\': \'headingChanged()\', \'map-idle\': \'idle()\', \'map-maptypeid_changed\': \'maptypeidChanged()\', \'map-mousemove\': \'mousemove()\', \'map-mouseout\': \'mouseout()\', \'map-mouseover\': \'mouseover()\', \'map-projection_changed\': \'projectionChanged()\', \'map-resize\': \'resize()\', \'map-rightclick\': \'rightclick()\', \'map-tilesloaded\': \'tilesloaded()\', \'map-tilt_changed\': \'tiltChanged()\', \'map-zoom_changed\': \'zoomChanged()\' }" class="map-canvas"></div><div ng-repeat="marker in markers" ui-map-marker="marker" ui-event="{\'map-click\': \'showResult(marker.title)\'}"></div><div ui-map-info-window="myInfoWindow">Lat: <input ng-model="currentMarkerLat">, Lng: <input ng-model="currentMarkerLng"> <button ng-click="setMarkerPosition(currentMarker, currentMarkerLat, currentMarkerLng)">Update</button></div></section>');
}]);
})();

(function(module) {
try {
  module = angular.module('mlGoogleMapsDemo.Tpls');
} catch (e) {
  module = angular.module('mlGoogleMapsDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-google-maps-ng/ml-search-map-legend-dir.html',
    '<div class="map-legend"><span ng-repeat="(index, facet) in facets | object2Array | hasBoxes"><span ng-class="{0: \'map-cluster-icon icon1\', 1: \'map-cluster-icon icon2\', 2: \'map-cluster-icon icon3\', 3: \'map-cluster-icon icon4\', 4: \'map-cluster-icon icon5\' }[index]"></span> <label>{{facet.label ? facet.label : facet.__key}}</label></span></div>');
}]);
})();
