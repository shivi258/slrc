require([
"esri/views/MapView",
"esri/Map",
"esri/widgets/DistanceMeasurement2D",
"esri/widgets/DistanceMeasurement2D/DistanceMeasurement2DViewModel",
"esri/widgets/Search"
], function(MapView, Map, DistanceMeasurement2D,DistanceMeasurement2DViewModel, Search) {
    var activeWidget = null;
    const webmap = new Map ({
        basemap: "streets-navigation-vector"
    });
    // create the map view
    const view = new MapView({
        container: "viewDiv",
        map: webmap,
        zoom: 1
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
        .getElementById("option5")
        .addEventListener("click", function() {
               var cb = document.getElementById("option5");
               if (cb.checked) {
                   document.getElementById("more").style.display="block";
               } else {
                document.getElementById("more").style.display="none";
               }
            }
        );
    document
            .getElementById("calculate")
            .addEventListener("click", function (){
                var op1 = document.getElementById("option1");
                var op2 = document.getElementById("option2");
                var op3 = document.getElementById("option3");
                var op4 = document.getElementById("option4");
                var op5 = document.getElementById("option5");
                var op6 = document.getElementById("option6");
                var op7 = document.getElementById("option7");
                var op8 = document.getElementById("option8");
                

                var base_multiplier = 1000;
                
                var option1 = 20;
                var option2 = 30;
                var option3 = 40;
                var option4 = 50;
                var option5 = 0;
                var option6 = 70;
                var option7 = 80;
                var option8 = 90;

                var incr = 0;

                if (op1.checked) {
                    incr += option1;
                }
                if (op2.checked) {
                    incr += option2;
                }
                if (op3.checked) {
                    incr += option3;
                } 
                if (op4.checked) {
                    incr += option4;
                } 
                if (op5.checked) {
                    incr += option5;
                } 
                if (op6.checked) {
                    incr += option6;
                } 
                if (op7.checked) {
                    incr += option7;
                } 
                if (op8.checked) {
                    incr += option8;
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
                        view.zoom = 16
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
        document.getElementById("length").value = len;
        document.getElementById("unit").value = metric;
        document.getElementById("costcalculation").style.display = "block";
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