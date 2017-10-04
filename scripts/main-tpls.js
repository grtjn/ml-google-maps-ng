(function(module) {
try {
  module = angular.module('mlGoogleMapsDemo.Tpls');
} catch (e) {
  module = angular.module('mlGoogleMapsDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/home.html',
    '<h1 class="page-header" itemprop="name">Google Maps for MarkLogic</h1><div class="home row"><h4>Key features</h4><ul><li>Show multiple geospatial facets on one map</li><li>Fast display of cluster markers</li><li>Distinctly colored markers per facet</li><li>Automatic legend display</li><li>Mouse interaction:<ul><li>Double-click to zoom in and limit geo search</li><li>Drag to change center and limit geo search</li><li>Draw rectangles to limit geo search</li><li>Right-click to reset zoom and center</li><li>Click on single point markers to show details</li></ul></li></ul><h4>Example</h4><div class="row"><div class="col-md-10 col-md-offset-1"><div class="alert alert-info" role="alert"><strong>Note:</strong> This example is running with static data. Is is possible to make zooming in respond with recalculation of heatmap to get finer detail, but that is not shown here.</div><ml-google-search-map map="model.searchMap.map" options="model.searchMap.options" facets="model.search.facets" markers="model.searchMap.markers" bounds-changed="boundsChanged(bounds)" show-result="showResult(uri)" show-context-menu="resetMap()" selections="model.searchMap.selections"></ml-google-search-map><ml-google-search-map-legend facets="model.search.facets"></ml-google-search-map-legend></div></div><div style="display:none">{{model.search}}</div></div>');
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
    '<h1 class="page-header">Quickstart</h1><div class="row"><div class="col-md-12"><p>To start using Google Maps for MarkLogic, follow these simple steps to get started.</p><h3>For use with slush-marklogic-node</h3><p>The <a href="https://github.com/marklogic-community/slush-marklogic-node">slush-marklogic-node</a> has been optimized to make pulling in components like this as easy as possible</p><ol class="steps"><li><div hljs="" no-escape="" language="bash">bower install --save ml-google-maps-ng</div></li><li><p>Include this at the end of the <code>&lt;head&gt;</code> of <code>ui/index.html</code>:</p><div hljs="" no-escape="" language="html" source="\'<script src=\\\'//maps.googleapis.com/maps/api/js?v=3.&libraries=drawing&sensor=false\\\'></script>\'"></div></li><li><p>Include <code>\'ml.google-maps\'</code> as a module dependency in for instance <code>ui/app/search/search.module.js</code>:</p><div hljs="" no-escape="" language="js">angular.module(\'app.search\', [..., \'ml.google-maps\']);</div></li><li><p>Edit <code>ui/app/search/search.controller.js</code>, and add:</p><pre hljs="" no-escape="" language="js">\n' +
    '\n' +
    'SearchCtrl.$inject = [..., \'$state\', \'MLQueryBuilder\'];\n' +
    '\n' +
    'function SearchCtrl(..., $state, qb) {\n' +
    '  ...\n' +
    '\n' +
    '  var initMapOptions = {\n' +
    '    center: new $window.google.maps.LatLng(0, 0),\n' +
    '    zoom: 2,\n' +
    '    mapTypeId: $window.google.maps.MapTypeId.ROADMAP\n' +
    '  };\n' +
    '\n' +
    '  ctrl.myMap = {\n' +
    '    map: null,\n' +
    '    options: angular.extend({}, initMapOptions),\n' +
    '    markers: [],\n' +
    '    selections: []\n' +
    '  };\n' +
    '\n' +
    '  ctrl.boundsChanged = function() {\n' +
    '    // can get triggered at initial setZoom..\n' +
    '    if (newBounds) {\n' +
    '\n' +
    '      // This expects a google.maps.LatLng object\n' +
    '      var south = newBounds.getSouthWest().lat();\n' +
    '      var west = newBounds.getSouthWest().lng();\n' +
    '      var north = newBounds.getNorthEast().lat();\n' +
    '      var east = newBounds.getNorthEast().lng();\n' +
    '\n' +
    '      ctrl.bounds = {\n' +
    '        \'south\': south,\n' +
    '        \'west\': west,\n' +
    '        \'north\': north,\n' +
    '        \'east\': east\n' +
    '      };\n' +
    '\n' +
    '      ctrl.mlSearch.clearAdditionalQueries();\n' +
    '      ctrl.mlSearch.addAdditionalQuery(\n' +
    '        qb.or(\n' +
    '          // This assumes a geo facet called `Locations`.\n' +
    '          // Repeat following line for each geo facet in the app.\n' +
    '          qb.ext.geospatial(\'Locations\', ctrl.bounds)\n' +
    '        )\n' +
    '      );\n' +
    '\n' +
    '      ctrl.search();\n' +
    '    }\n' +
    '  };\n' +
    '\n' +
    '  ctrl.resetMap = function() {\n' +
    '    ctrl.myMap.options = angular.extend({}, initMapOptions);\n' +
    '    angular.forEach(ctrl.myMap.selections, function(overlay, index) {\n' +
    '      overlay.setMap(null);\n' +
    '    });\n' +
    '    ctrl.myMap.selections.length = 0;\n' +
    '  };\n' +
    '\n' +
    '  ctrl.showResult = function(result) {\n' +
    '    var uri = result.uri || result;\n' +
    '    $state.go(\'root.view\', { uri: uri });\n' +
    '  };\n' +
    '}\n' +
    '</pre></li><li><p>Add a <code>&lt;ml-google-search-map&gt;</code> and a <code>&lt;ml-google-search-map-legend&gt;</code> element in your template like so:</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;ml-google-search-map map="$ctrl.myMap.map" options="$ctrl.myMap.options"\n' +
    '            facets="$ctrl.response.facets" markers="$ctrl.myMap.markers" bounds-changed="$ctrl.boundsChanged(bounds)"\n' +
    '            show-result="$ctrl.showResult(uri)" show-context-menu="$ctrl.resetMap()" selections="$ctrl.myMap.selections">\n' +
    '&lt;/ml-google-search-map>\n' +
    '\n' +
    '&lt;ml-google-search-map-legend facets="$ctrl.response.facets">&lt;/ml-google-search-map-legend></pre></li><li><p>Optionally override the height via CSS for the map container:</p><div hljs="" no-escape="" language="css">.map-canvas { height: 400px !important; }</div></li></ol><h4>Improved zooming behavior (for slush-marklogic-node)</h4><p>By default MarkLogic applies a fixed heatmap grid to come up with aggregate results. There is a custom facet though that improves this.</p><ol class="steps"><li><p>Disable search options validation, edit <code>rest-api/config/properties.xml</code>, and change the validate-options setting to false. Run <code>./ml local deploy rest</code> to apply.</p></li><li><p>Download <a href="geo.xqy">geo.xqy</a>, and copy into <code>src/constraint/</code></p></li><li><p>Edit your existing geospatial facet, and wrap it in a custom constraint as follows:</p><div hljs="" no-escape="" language="xml"><constraint name="Locations">&lt;custom> &lt;parse apply="parse-structured" ns="http://marklogic.com/appservices/viz/geo" at="/constraint/geo.xqy"/> &lt;start-facet apply="start" ns="http://marklogic.com/appservices/viz/geo" at="/constraint/geo.xqy"/> &lt;finish-facet apply="finish" ns="http://marklogic.com/appservices/viz/geo" at="/constraint/geo.xqy"/> &lt;/custom> &lt;annotation> &lt;-- insert original range definition here --> &lt;/annotation> &lt;/constraint></constraint></div></li><li><p>Edit <code>ui/app/search/search.controller.js</code>, and replace:</p><pre hljs="" no-escape="" language="js">\n' +
    '  qb.ext.geospatial(\'Locations\', ctrl.bounds)\n' +
    '</pre><p>with:</p><pre hljs="" no-escape="" language="js">\n' +
    '  qb.ext.custom(\'Locations\', qb.ext.geospatialValues(ctrl.bounds))\n' +
    '</pre></li></ol><h3>Generic steps</h3><ol class="steps"><li><p>Download <a href="https://raw.github.com/grtjn/ml-google-maps-ng/master/dist/ml-google-maps-ng.js">ml-google-maps-ng.js</a> (<a href="https://raw.github.com/grtjn/ml-google-maps-ng/master/dist/ml-google-maps-ng.min.js">minified version</a>) and put it with your other scripts. Alternatively, you can use Bower to install it automatically:</p><div hljs="" no-escape="" language="bash">bower install [--save] ml-google-maps-ng</div><p>Or if you prefer bleeding edge:</p><div hljs="" no-escape="" language="bash">bower install [--save] git@github.com:grtjn/ml-google-maps-ng.git</div><p>If not using Bower, you\'ll also need to fetch <a href="https://github.com/angular-ui/ui-utils/tree/v0.2.3" rel="external">ui-utils.js (v0.2.3)</a>, and <a href="https://github.com/angular-ui/ui-map/tree/v0.5.0" rel="external">ui-map.js (v0.5.0)</a> yourself.</p></li><li><p>Load ui-utils.js, ui-map.js, and ml-google-maps-ng.js into your HTML page (typically in the end of the <em>BODY</em> of your HTML):</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;script src=\'/bower_components/angular-ui-utils/ui-utils[.min].js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/angular-ui-map/ui-map[.min].js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/ml-google-maps-ng/dist/ml-google-maps-ng[.min].js\'>&lt;/script></pre><p class="text-muted">Note: You can simplify this by making use of <a href="https://www.npmjs.com/package/wiredep" rel="external">wiredep</a>, optionally together with <a href="https://www.npmjs.com/package/gulp-useref" rel="external">gulp-useref</a>.</p></li><li><p>Include the Google Maps API v3, via:</p><ul><li><p>Directly load into your HTML page. Example:</p><div hljs="" no-escape="" language="html" source="\'<script src=\\\'//maps.googleapis.com/maps/api/js?v=3.&libraries=drawing&sensor=false\\\'></script>\'"></div><p class="text-muted">Note: If you go down this route, ensure that it is loaded prior to angular-google-maps.js! The easiest way to do this is to put loading the google maps api in the HTML head, and all angular code in the HTML body.</p></li></ul><strong>Serving Google Maps in China</strong><p>It is a state demand that all online map providers must use an obscured coordinate system called GCJ-02 (aka Coordinates on Mars). GCJ-02 is WSG-84 based, but added offsets to both latitude and longitude.</p><p>If you display a marker from GCJ-02 coordinates on a GCJ-02 map, the place will be marked correctly.<br>However the offsets can result in a less-than-100 up to 700 meter error from the actual location if you place a GCJ-02 marker on a WSG-84 map and vice versa.</p><p>There is an <a href="https://github.com/googollee/eviltransform" target="_blank">open-source project</a> that can provide approximate translation between GCJ-02 and WSG-84.</p><p>Google also submits to this regulation. They serve this modified system at maps.google.cn.If you manually load the Google Maps API, replace <code>//maps.googleapis.com/maps/api/js</code> with <code>http://maps.google.cn/maps/api/js</code>.</p></li><li><p>Load ml-google-maps-ng.css into your HTML page (typically in the end of the <em>HEAD</em> of your HTML):</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;link rel="stylesheet" href="/bower_components/ml-google-maps-ng/dist/ml-google-maps-ng.css"></pre><p class="text-muted">Note: You can simplify this by making use of <a href="https://www.npmjs.com/package/wiredep" rel="external">wiredep</a>, optionally together with <a href="https://www.npmjs.com/package/gulp-useref" rel="external">gulp-useref</a>.</p><p class="text-muted">Note: If you go down the route of using gulp-useref, you will likely need to copy images to a folder that is publicly accessible as /images/, otherwise images for the map markers cannot be found by the directive.</p></li><li><p>Make your application module depend on the <code>ml-google-maps-ng</code> module:</p><div hljs="" no-escape="" language="js">angular.module(\'myApplicationModule\', [\'ml.google-maps\']);</div></li><li><p>Expose objects and call-back functions in your Angular controller:</p><pre hljs="" no-escape="" language="js">\n' +
    'MyCtrl.$inject = [\'$scope\'];\n' +
    'function MyCtrl($scope) {\n' +
    '  var ctrl = this;\n' +
    '\n' +
    '  var initMapOptions = {\n' +
    '    center: new $window.google.maps.LatLng(52.3881895, 4.8447237),\n' +
    '    zoom: 10,\n' +
    '    mapTypeId: $window.google.maps.MapTypeId.ROADMAP\n' +
    '  };\n' +
    '\n' +
    '  ctrl.myMap = {\n' +
    '    map: null,\n' +
    '    options: angular.extend({}, initMapOptions),\n' +
    '    markers: [],\n' +
    '    selections: []\n' +
    '  };\n' +
    '\n' +
    '  ctrl.myFacets = {\n' +
    '    facets: {\n' +
    '      locations: {\n' +
    '        count: 4262,\n' +
    '        boxes: [{\n' +
    '          count: 625,\n' +
    '          s: 52.28889,\n' +
    '          w: 4.856865,\n' +
    '          n: 52.33222,\n' +
    '          e: 5.019565\n' +
    '        }, {\n' +
    '          count: 1301,\n' +
    '          s: 52.33256,\n' +
    '          w: 4.763993,\n' +
    '          n: 52.40219,\n' +
    '          e: 4.844532\n' +
    '        }, {\n' +
    '          count: 2336,\n' +
    '          s: 52.33251,\n' +
    '          w: 4.844792,\n' +
    '          n: 52.42354,\n' +
    '          e: 5.025896\n' +
    '        }]\n' +
    '      }\n' +
    '    }\n' +
    '  };\n' +
    '\n' +
    '  ctrl.boundsChanged = function() {\n' +
    '    // place your geospatial search code here, and make that update $scope.myFacets\n' +
    '  };\n' +
    '\n' +
    '  ctrl.resetMap = function() {\n' +
    '    ctrl.myMap.options = angular.extend({}, initMapOptions);\n' +
    '    angular.forEach(ctrl.myMap.selections, function(overlay, index) {\n' +
    '      overlay.setMap(null);\n' +
    '    });\n' +
    '    ctrl.myMap.selections.length = 0;\n' +
    '  };\n' +
    '\n' +
    '  ctrl.showResult = function(uri) {\n' +
    '    $window.alert(\'You clicked \' + uri);\n' +
    '  };\n' +
    '}\n' +
    '</pre></li><li><p>Add a <code>&lt;ml-google-search-map&gt;</code> and a <code>&lt;ml-google-search-map-legend&gt;</code> element in your template like so:</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;ml-google-search-map map="myMap.map" options="myMap.options"\n' +
    '            facets="myFacets.facets" markers="myMap.markers" bounds-changed="boundsChanged(bounds)"\n' +
    '            show-result="showResult(uri)" show-context-menu="resetMap()" selections="myMap.selections">\n' +
    '&lt;/ml-google-search-map>\n' +
    '\n' +
    '&lt;ml-google-search-map-legend facets="myFacets.facets">&lt;/ml-google-search-map-legend></pre></li><li><p>Optionally override the height via CSS for the map container:</p><div hljs="" no-escape="" language="css">.map-canvas { height: 400px !important; }</div></li></ol></div></div>');
}]);
})();
