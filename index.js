require([
"esri/views/MapView",
"esri/Map",
"esri/widgets/DistanceMeasurement2D",
"esri/widgets/Search"
], function(MapView, Map, DistanceMeasurement2D, Search) {
    var activeWidget = null;
    const webmap = new Map ({
        basemap: "topo"
    });
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
            .getElementById("calculate")
            .addEventListener("click", function (){
                var sidewalk = document.getElementById("sidewalk");
                var trees = document.getElementById("trees");
                var landscaping = document.getElementById("landscaping");
                var plantclusters = document.getElementById("plantclusters");
                var powerlines = document.getElementById("powerlines");
                var driveway = document.getElementById("driveway");
                var asphalt = document.getElementById("asphalt");
                var gravel = document.getElementById("gravel");
                var exposedaggregate = document.getElementById("exposedaggregate");
                var concrete = document.getElementById("concrete");
                var stone = document.getElementById("stone");
                // var op12 = document.getElementById("gravel");

                var base_multiplier = 475;
                
                var sidewalk_cost = 100;
                var trees_cost = 100;
                var landscaping_cost = 100;
                var plantclusters_cost = 100;
                var powerlines_cost = 100;
                var driveway_cost = 0;
                var asphalt_cost = 100;
                var gravel_cost = 100;
                var aggregate_cost = 100;
                var concrete_cost = 100;
                var stone_cost = 100;
                // var length_under_asphalt_cost = 234;

                var incr = 0;

                if (sidewalk.checked) {
                    incr += sidewalk_cost;
                }
                if (trees.checked) {
                    incr += trees_cost;
                }
                if (landscaping.checked) {
                    incr += landscaping_cost;
                } 
                if (plantclusters.checked) {
                    incr += plantclusters_cost;
                } 
                if (powerlines.checked) {
                    incr += powerlines_cost;
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
    
    // document
    //     .getElementById("costButton")
    //     .addEventListener("click", function() {
    //            setActiveWidget(null);
    //             if (!this.classList.contains("active")) {
    //                 setActiveWidget("search");
    //             } else {
    //             setActiveButton(null);
    //             }
    //         }
    //     );

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
                    console.log(state, activeWidget.viewModel.measurement.length);
                    if (state == 'measured') {
                        setLength(activeWidget.viewModel.measurement.length, activeWidget.unit);
                        console.log(activeWidget.viewModel.measurement.length);
                        console.log('Current unit: ', activeWidget.unit);
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
        document.getElementById("finalCost").innerHTML = base_cost + incr;
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
});