require([
"esri/views/MapView",
"esri/Map",
"esri/widgets/DistanceMeasurement2D",
"esri/widgets/Search",
"esri/layers/FeatureLayer"
], function(MapView, Map, DistanceMeasurement2D, Search, FeatureLayer) {
    var activeWidget = null;
    // var base = new Basemap ({
    //     baseLayers: "https://tiles.arcgis.com/tiles/11XBiaBYA9Ep0yNJ/arcgis/rest/services/HalifaxBasemap/MapServer"
    // })
    const webmap = new Map ({
        basemap: "topo"
    });

    // var parcelLayer = new FeatureLayer({
    //     url: "https://services2.arcgis.com/11XBiaBYA9Ep0yNJ/arcgis/rest/services/HRM_Parcel_Polygon_with_Accounts/FeatureServer",
    //     id: "parcel"
    // });

    var leadBoundaryLayer = new FeatureLayer ({
        url: "https://services3.arcgis.com/yc7ImJOpfSdSicRP/arcgis/rest/services/DEV_LeadBoundary_2/FeatureServer",
        id: "lead"
    });

    leadBoundaryLayer.opacity = 0.5;
    
    webmap.layers.add (leadBoundaryLayer);
    
    // create the map view
    const view = new MapView({
        container: "viewDiv",
        map: webmap,
        center: [-63.582687, 44.651070],
        zoom: 13
    });
    // add the toolbar for the measurement widgets
    view.ui.add("topbar", "top-right");

    document
        .getElementById("viewButton")
        .addEventListener("click", function() {
                setActiveWidget(null);
                webmap.layers.add (leadBoundaryLayer);
                // Window.reload();
            }
        );

    document
        .getElementById("hideButton")
        .addEventListener("click", function () {
                setActiveWidget (null);
                webmap.layers.remove (leadBoundaryLayer);
                // Window.reload();
        })

    document
        .getElementById("distanceButton")
        .addEventListener("click", function() {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("distance");
                } else {
                    setActiveButton(null);
                }
            }
        );
    document
        .getElementById("searchButton")
        .addEventListener("click", function() {
               setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("search");
                } else {
                setActiveButton(null);
                }
            }
        );
    document
        .getElementById("refresh")
        .addEventListener("click", function() {
                activeWidget.destroy();
                document.getElementById("costcalculation").style.display = "none";                
                setActiveWidget("distance");
            }
        );

    document
        .getElementById("driveway")
        .addEventListener("click", function() {
               var cb = document.getElementById("driveway");
               if (cb.checked) {
                   document.getElementById("more").style.display="block";
                //    document.getElementById("info").style.display = "none";
               } else {
                document.getElementById("more").style.display="none";
               }
            }
        );
    document
        .getElementById("trees_check")
        .addEventListener("click", function() {
            var cb = document.getElementById("trees_check");
            if(cb.checked) {
                document.getElementById("trees").style.display="block";
            } else {
                document.getElementById("trees").style.display="none";
            }
        })
    document
        .getElementById("plantclusters")
        .addEventListener("click", function() {
            var cb = document.getElementById("plantclusters");
            if(cb.checked) {
                document.getElementById("plants").style.display="block";
            } else {
                document.getElementById("plants").style.display="none";
            }
        })
    document
            .getElementById("calculate")
            .addEventListener("click", function (){
                var sidewalk = document.getElementById("sidewalk");
                var trees = document.getElementById("trees_check");
                var landscaping = document.getElementById("landscaping");
                var plantclusters = document.getElementById("plantclusters");
                var gutter = document.getElementById("gutter");
                var driveway = document.getElementById("driveway");
                var asphalt = document.getElementById("asphalt");
                var gravel = document.getElementById("gravel");
                var exposedaggregate = document.getElementById("exposedaggregate");
                var concrete = document.getElementById("concrete");
                var stone = document.getElementById("stone");

                // cost variables

                var base_multiplier = 440;
                var sidewalk_cost = 570;
                var trees_cost = 200;
                var plantclusters_cost = 200;

                var gutter_cost = 240;

                var driveway_cost = 0;
                var landscaping_cost = 480;
                
                var asphalt_cost = 200;
                var gravel_cost = 100;
                var aggregate_cost = 400;
                var concrete_cost = 300;
                var stone_cost = 400;

                var incr = 0;

                if (sidewalk.checked) {
                    incr += sidewalk_cost;
                }
                if (trees.checked) {
                    var n = document.getElementById("tree_number").value;
                    var cost = n * trees_cost;
                    incr += cost;
                }
                if (landscaping.checked) {
                    incr += landscaping_cost;
                } 
                if (plantclusters.checked) {
                    var n = document.getElementById("cluster_number").value;
                    var cost = n * plantclusters_cost;
                    incr += cost;
                } 
                if (gutter.checked) {
                    incr += gutter_cost;
                } 
                if (driveway.checked) {
                    incr += driveway_cost;
                    if (asphalt.checked) {
                        incr += asphalt_cost;
                    } 
                    if (gravel.checked) {
                        incr += gravel_cost;
                    }
                    if (exposedaggregate.checked) {
                        incr += aggregate_cost;
                    }
                    if (concrete.checked) {
                        incr += concrete_cost;
                    }
                    if (stone.checked) {
                        incr += stone_cost;
                    }
                } 
                base_cost = (document.getElementById("length").value) * base_multiplier;

                displayCost (base_cost, incr);

            })

    function setActiveWidget(type) {
        switch (type) {
            case "distance":
                activeWidget = new DistanceMeasurement2D({
                    viewModel: {
                        view: view,
                        mode: "planar",
                        unit: "metric"
                    }
                });
                // skip the initial 'new measurement' button
                activeWidget.viewModel.newMeasurement();

                view.ui.add(activeWidget, "top-right");
                
                activeWidget.watch("viewModel.state", function(state) {
                    if (state == 'measured') {
                        setLength(activeWidget.viewModel.measurement.length, activeWidget.unit);
                        view.ui.remove(activeWidget);
                    }
                });
                
                setActiveButton(document.getElementById("distanceButton"));
            break;

            case "search":
                activeWidget = new Search({
                    view: view
                });
                view.ui.add(activeWidget, "top-right");
                setActiveButton(document.getElementById("searchButton"));

                activeWidget.on (
                    "select-result", function(e) {
                        view.zoom = 18
                    },
                    // setActive(document.getElementById("distanceButton"))
                );

            break;

            case null:
                if (activeWidget) {
                    view.ui.remove(activeWidget);
                    activeWidget.destroy();
                    activeWidget = null;
              }
            break;
          }
        }
    
    function displayCost (base_cost, incr) {
        var cost = (base_cost + incr).toFixed(2);
        document.getElementById("finalCost").innerHTML = cost;
    }

    function setLength (len, metric) {
        len = Math.round(len * 100) / 100;
        // var met = metric;
        document.getElementById("length").value = len;
        // document.getElementById("unit").innerHTML = met;
        document.getElementById("costcalculation").style.display = "block";
        // activeWidget.destroy();
    }
    function setActiveButton(selectedButton) {
        // focus the view to activate keyboard shortcuts for sketching
        view.focus();
        var elements = document.getElementsByClassName("active");
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
            // elements[i].disabled = true;
        }
        if (selectedButton) {
            selectedButton.classList.add("active");
            // selectedButton.disabled = false;
        }
    }
})