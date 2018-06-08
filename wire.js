var wire_current = 1; //or -1
var wires = new Array()
////////////////////IMPORTANT THINGS
/*


line = document.createElementNS("http://www.w3.org/2000/svg", "line"); //circle, text
line.setAttribute("x1", 10);
line.setAttribute("x2", 10);
line.setAttribute("y1", 10);
line.setAttribute("y2", 10);
line.setAttribute("stroke-width", 10);
line.setAttribute("stroke", "black");
svg.appendChild(line);


*/

//e.clientX this is for the screen
//e.offsetX this is for the svg


var svg = document.getElementById("vimage");
var height = svg.getAttribute('height');
var width = svg.getAttribute('width');


//svg.addEventListener("click", function(e){console.log(e.offsetX, e.offsetY);} );

svg.addEventListener("click", function(e){
    //updateVectors(e);
    console.log(vector_field[vector_field.length - 6][5].xcor,vector_field[vector_field.length - 6][5].ycor,vector_field[vector_field.length - 6][5].xmag,vector_field[vector_field.length - 6][5].ymag, e.offsetX, e.offsetY )
} );

svg.addEventListener("mousedown", function(e){
    selectedElement = e.target;
    if (selectedElement.tagName != "circle") {
	addWire(e);
	updateVectors(e);    };
} );


//var vector = {xmag:"500", color:"white"};
var vector_field;

var makeVector = function(xcor, ycor, xmag, ymag) {
    //var vector = document.createElementNS("http://www.w3.org/2000/svg", "line");
    var vector = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    vector.xcor = xcor;
    vector.ycor = ycor;
    vector.xmag = xmag;
    vector.ymag = ymag;

    vector.addtoY = function(newymag){ vector.ymag += newymag; };
    vector.addtoX = function(newxmag){ vector.xmag += newxmag; };
    vector.addVector = function(newX, newY){ vector.addtoX(newX); vector.addtoY(newY); };

    vector.update = function(xcor, ycor, current) {
	var ydist = ycor - vector.ycor;
	var xdist = xcor - vector.xcor;

	var dist = Math.sqrt( (ydist*ydist) + (xdist*xdist) );

	var distAngle = Math.atan( ydist / xdist);
	
	
	//var ymagchange = ( current * Math.sin(distAngle) ) / (dist * dist)
	if (xdist < 0) {
	    var xmagchange = ( current * Math.cos(distAngle) ) / (dist * dist)
	    var ymagchange = ( current *  Math.sin(distAngle) ) / (dist * dist)
	} else {
	    var xmagchange = ( current * -1 * Math.cos(distAngle) ) / (dist * dist)
	    var ymagchange = ( current * -1 * Math.sin(distAngle) ) / (dist * dist)
	}

	
	
	vector.xmag += xmagchange;
	vector.ymag += ymagchange;
	
	//console.log(vector.xmag, vector.ymag);
	//console.log(angle);
	if (isNaN( Math.atan(vector.ymag / vector.xmag) )) {
	    angle = 0;
	} else {
	    if (vector.xmag < 0) {
		if (vector.ymag < 0) {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI) + 180;
		} else {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI) + 180;
		};
	    } else {
		if (ymag < 0) {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI);
		} else {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI);
		};
	    }
	};

	angle += 90;

	var mag = Math.sqrt(vector.xmag * vector.xmag + vector.ymag * vector.ymag);
	
	//var fill = "rgb(" + (255 -Math.floor(-1*Math.log(mag)*5)) + "," + Math.floor(-1*Math.log(mag)*5) + "," + Math.floor(-1*Math.log(mag)*5) + " )";

	var red = 0;
	var green = 0; //255 - (((Math.floor(Math.log(mag)) + 13) * 50));
	var blue = 0;
	//var transparency = 1.0 - ( 1.0 / ( Math.floor(Math.log(mag)) + 13 ) );
	//var transparency = (( Math.floor(Math.log(mag)) + 13 ) * 0.3 );
	var transparency = (((Math.log(mag)) + 13 ) * 0.3 )/4;
	makeColorVal(green);
	makeTransparencyVal(transparency);
	var fill = "rgb(" + red + "," + green + "," + blue + "," + transparency + ")";
	vector.setAttribute("stroke", fill);
	
	vector.setAttribute("stroke-width", 5);
	//console.log("stroke" , vector.getAttribute("stroke"));
	//console.log(angle);
	vector.setAttribute("transform", 'rotate(' + angle + ' ' + vector.xcor + ' ' + vector.ycor + ')' );
    };
    
	
	////////////////////////////////////
	
    vector.dragupdate = function(xcor, ycor, wire) {
	var ydist = wire.ycor - vector.ycor;
	var xdist = wire.xcor - vector.xcor;
	//console.log(wire.current)
	
	var dist = Math.sqrt( (ydist*ydist) + (xdist*xdist) );
	
	var distAngle = Math.atan( ydist / xdist);
	
	
	//var ymagchange = ( current * Math.sin(distAngle) ) / (dist * dist)
	if (xdist < 0) {
	    var xmagchange = ( wire.current * Math.cos(distAngle) ) / (dist * dist)
	    var ymagchange = ( wire.current *  Math.sin(distAngle) ) / (dist * dist)
	} else {
	    var xmagchange = ( wire.current * -1 * Math.cos(distAngle) ) / (dist * dist)
	    var ymagchange = ( wire.current * -1 * Math.sin(distAngle) ) / (dist * dist)
	}
	
	
	
	vector.xmag -= xmagchange;
	vector.ymag -= ymagchange;
	

	//wire.xcor = xcor;
	//wire.ycor = ycor;
	
	ydist = wire.getAttribute("cy") - vector.ycor;
	xdist = wire.getAttribute("cx") - vector.xcor;
	
	dist = Math.sqrt( (ydist*ydist) + (xdist*xdist) );
	
	distAngle = Math.atan( ydist / xdist);
	
	
	//var ymagchange = ( current * Math.sin(distAngle) ) / (dist * dist)
	if (xdist < 0) {
	    var xmagchange = ( wire.current * Math.cos(distAngle) ) / (dist * dist)
	    var ymagchange = ( wire.current *  Math.sin(distAngle) ) / (dist * dist)
	} else {
	    var xmagchange = ( wire.current * -1 * Math.cos(distAngle) ) / (dist * dist)
	    var ymagchange = ( wire.current * -1 * Math.sin(distAngle) ) / (dist * dist)
	}

	vector.xmag += xmagchange;
	vector.ymag += ymagchange;
	
	
	
	//console.log(vector.xmag, vector.ymag);
	//console.log(angle);
	if (isNaN( Math.atan(vector.ymag / vector.xmag) )) {
	    angle = 0;
	} else {
	    if (vector.xmag < 0) {
		if (vector.ymag < 0) {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI) + 180;
		} else {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI) + 180;
		};
	    } else {
		if (ymag < 0) {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI);
		} else {
		    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI);
		};
	    }
	};
	
	angle += 90;

	var mag = Math.sqrt(vector.xmag * vector.xmag + vector.ymag * vector.ymag);
	
	//var fill = "rgb(" + (255 -Math.floor(-1*Math.log(mag)*5)) + "," + Math.floor(-1*Math.log(mag)*5) + "," + Math.floor(-1*Math.log(mag)*5) + " )";

	var red = 0;
	var green = 0; //255 - (((Math.floor(Math.log(mag)) + 13) * 50));
	var blue = 0;
	//var transparency = 1.0 - ( 1.0 / ( Math.floor(Math.log(mag)) + 13 ) );
	//var transparency = (( Math.floor(Math.log(mag)) + 13 ) * 0.3 );
	var transparency = (((Math.log(mag)) + 13 ) * 0.3 )/4;
	makeColorVal(green);
	makeTransparencyVal(transparency);
	var fill = "rgb(" + red + "," + green + "," + blue + "," + transparency + ")";
	vector.setAttribute("stroke", fill);

	
	//console.log(angle);
	vector.setAttribute("transform", 'rotate(' + angle + ' ' + vector.xcor + ' ' + vector.ycor + ')' );
    };
    
    
    var radius = 15;
    //var vector = document.createElementNS("http://www.w3.org/2000/svg", "line");
    //vector.setAttribute("x1", xcor - radius);
    //vector.setAttribute("y1", ycor );
    //vector.setAttribute("x2", xcor + radius);
    //vector.setAttribute("y2", ycor );
    //var pointsList = [ xcor - radius + ',' + ycor + ' ' + xcor + radius + ',' + ycor + 2 + ',' + xcor + radius + 2 + ' ' + ycor + ',' + xcor + radius + ' ' + ycor - 2 ]
    var pointsList = [ [xcor - radius, ycor ], [xcor + radius, ycor ], [ xcor + radius, ycor + 2], [ xcor + radius + 2, ycor], [ xcor + radius, ycor - 2], [xcor + radius, ycor ] ]
    vector.setAttribute("points" , pointsList) 
    vector.setAttribute("stroke-width", 0);
    vector.setAttribute("stroke", "black");
    var angle = 0;
    if (isNaN( Math.atan(ymag / xmag) )) {
	angle = 0;
    } else {
	angle = Math.atan(ymag / xmag);
    }
    vector.setAttribute("transform", 'rotate(' + angle + ' ' + xcor + ' ' + ycor + ')' );

    svg.appendChild(vector);

    /*
    return {xcor: xcor,
	    ycor: ycor,
	    xmag: xmag,
	    ymag: ymag,
	    addtoY: function(newymag){ ymag += newymag; },
	    addtoX: function(newxmag){ xmag += newxmag; },
	    addVector : function(newX, newY){ addtoX(newX); addtoY(newY); },
	    
	    display : function() {
		//var cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		//cir.setAttribute("cx", xcor);
		//cir.setAttribute("cy", ycor);
		//cir.setAttribute("r", 10);
		//cir.setAttribute("fill", "blue");
		//cir.setAttribute("stroke", "black");
		////so far this next line just prints the xcor of the vector
		//cir.setAttribute("onclick", 'console.log(' + xcor + ')' );
		//svg.appendChild(cir)

		var radius = 10;
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", xcor - radius);
		line.setAttribute("y1", ycor - radius);
		line.setAttribute("x2", xcor + radius);
		line.setAttribute("y2", ycor + radius);
		line.setAttribute("stroke-width", 1);
		line.setAttribute("stroke", "black");
		var angle = 0;
		if (isNaN( Math.atan(ymag / xmag) )) {
		    angle = 0;
		} else {
		    angle = Math.atan(ymag / xmag);
		}
		line.setAttribute("transform", 'rotate(' + angle + ' ' + xcor + ' ' + ycor + ')' );
		svg.appendChild(line);
	    }
	   }
    */

    return vector;
};

var makeVectorField = function(cols, rows) {
    vector_field = new Array(cols);
    var i;
    for (i = 0; i < vector_field.length; i++) {
	xincrement = width / vector_field.length
	vector_field[i] = new Array(rows);
	var j;
	for (j = 0; j < vector_field[i].length; j++){
	    yincrement = height / vector_field[i].length;
	    vector_field[i][j] = makeVector(xincrement * i, height - (yincrement * j), 0,0)
	}
    }
};

makeVectorField(60, 20);
console.log(vector_field);

var displayVectors = function(){
    var i;
    for (i = 0; i < vector_field.length; i++) {
	var j;
	for (j = 0; j < vector_field[i].length; j++){
	    vector_field[i][j].display()
	}
    }
}
//displayVectors();



var addWire = function(e) {
    var cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    cir.setAttribute("cx", e.offsetX);
    cir.xcor = e.offsetX;
    cir.ycor = e.offsetY;
    cir.setAttribute("cy", e.offsetY);
    cir.setAttribute("r", 10);
    cir.setAttribute("fill", "blue");
    if (wire_current > 0) {
	cir.setAttribute("fill", "red");
    } else if (wire_current == 0) {
	console.log("wire with no current does nothing");
	cir.setAttribute("fill", "green");
    } else {
	cir.setAttribute("fill", "blue");
    }
    
    cir.setAttribute("stroke", "black");
    cir.setAttribute("stroke-width", 5);
    
    //cir.setAttribute("onload", "makeDraggable(evt)");
    cir.current = wire_current;
    //so far this next line just prints the xcor of the vector
    //cir.setAttribute("onclick", 'console.log(" this is a wire ",' + cir.current + ')' );
    svg.appendChild(cir);
    wires.push(cir);
}


var updateVectors = function(e) {
    var i;
    for (i = 0; i < vector_field.length; i++) {
	var j;
	for (j = 0; j < vector_field[i].length; j++){
	    vector_field[i][j].update( e.offsetX, e.offsetY, wire_current );
	}
    }
}

var updateVectorsBecauseDrag = function(e, wire) {
    var i;
    for (i = 0; i < vector_field.length; i++) {
	var j;
	for (j = 0; j < vector_field[i].length; j++){
	    vector_field[i][j].dragupdate( e.offsetX, e.offsetY, wire );
	}
    }
    wire.xcor = e.offsetX;
    wire.ycor = e.offsetY;
}



/////////////////FOR THE SLIDER
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}

var currentSlider = document.getElementById("currentRange");
var currentOutput = document.getElementById("currentOutput");
currentOutput.innerHTML = currentSlider.value; // Display the default slider value
currentSlider.oninput = function() {
    currentOutput.innerHTML = this.value;
    wire_current = this.value;
}

 
vector_field[vector_field.length - 6][5].setAttribute("stroke-width", "10");


////////////DRAGGING STUFF

var selectedElement = null;

function makeDraggable(evt) {
    console.log("drag")
    var element = evt.target;
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('mousemove', drag);
    element.addEventListener('mouseup', endDrag);
    element.addEventListener('mouseleave', endDrag);
    
    function startDrag(evt) {
	selectedElement = evt.target;
    }
    function drag(evt) {
	if (selectedElement) {
	    if (selectedElement.tagName != "svg" ){
		if (selectedElement.tagName == "circle" ){
		    evt.preventDefault();
		    var x = parseFloat(selectedElement.getAttributeNS(null, "x"));
		    selectedElement.setAttributeNS(null, "cx", evt.offsetX);
		    selectedElement.setAttributeNS(null, "cy", evt.offsetY);
		    updateVectorsBecauseDrag(evt, selectedElement);
		}
	    }
	}
    }
    function endDrag(evt) {
	selectedElement = null;
    }
}



var makeColorVal = function( num ) {
    if (num < 0) {
	num = 0;
    } else if (num > 255) {
	num = 255;
    } else {
	num = num;
    }
}

var makeTransparencyVal = function (num) {
    if (num < 0.1) {
	num = 0.1;
    } else if (num > 1) {
	num = 1;
    } else {
	num = num;
    }

}
