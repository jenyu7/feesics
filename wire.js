var wire_current = 1; //or -1
var wires = new Array()

var gridDrawn = false;

wire_info = document.getElementById("wire_info");


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
    //cir.setAttribute("click", function() { console.log(8); } )  ;
    cir.addEventListener("click", function(){
	wire_info.innerHTML = "Current of Selected Wire: " + cir.current;}
	);
    
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
/*
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}*/

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


///////////////DRAW THE GRID

var gridButton = document.getElementById("gridButton");

gridButton.addEventListener("click", function() {
    drawGrid();
} )

var drawGrid = function(){
    if (!gridDrawn) {
	var i;
	for (i = 0; i < vector_field.length; i++) {
	    var line;
	    line = document.createElementNS("http://www.w3.org/2000/svg", "line"); //circle, text
	    line.setAttribute("x1", vector_field[i][0].xcor);
	    line.setAttribute("x2", vector_field[i][0].xcor);
	    line.setAttribute("y1", 0);
	    line.setAttribute("y2", height);
	    line.setAttribute("stroke-width", 2);
	    line.setAttribute("stroke", "black");
	    svg.appendChild(line);
	    
	}
	var i;
	for (i = 0; i < vector_field[0].length; i++) {
	    var line;
	    line = document.createElementNS("http://www.w3.org/2000/svg", "line"); //circle, text
	    line.setAttribute("x1", 0);
	    line.setAttribute("x2", width);
	    line.setAttribute("y1", vector_field[0][i].ycor);
	    line.setAttribute("y2", vector_field[0][i].ycor);
	    line.setAttribute("stroke-width", 2);
	    line.setAttribute("stroke", "black");
	    svg.appendChild(line);    
	}
	gridButton.innerHTML = "Remove Grid";
	gridDrawn = true;
    } else {
	d3.selectAll("line").remove()
	gridButton.innerHTML = "Draw the Grid";
	gridDrawn = false;

    }
}

//Simulation 2
var svg2 = document.getElementById("timage");
var h2 = svg2.getAttribute('height');
var w2 = svg2.getAttribute('width');

svg2.addEventListener("click", function(e){
    //makeWires();
} );

/*svg2.addEventListener("mousedown", function(e){
    selectedElement = e.target;
    if (selectedElement.tagName != "circle") {
	addWire(e);
	updateVectors(e);    };
} );*/


//var vector = {xmag:"500", color:"white"};

var makeWires = function(x1, x2) {

    var wire1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    wire1.setAttribute("x1", x1);
    wire1.setAttribute("x2", x1);
    wire1.setAttribute("y1", 0);
    wire1.setAttribute("y2", h2);
    wire1.setAttribute("stroke-width", 20);
    wire1.setAttribute("stroke", "black");
    svg2.appendChild(wire1);

    var wire2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    wire2.setAttribute("x1", x2);
    wire2.setAttribute("x2", x2);
    wire2.setAttribute("y1", 0);
    wire2.setAttribute("y2", h2);
    wire2.setAttribute("stroke-width", 20);
    wire2.setAttribute("stroke", "black");
    svg2.appendChild(wire2);



    //makeDraggable(evt);
    
};

var makeMag = function(xcor, ycor, type){
    var mag;
    //going into page
    if (type == 0){
	mag = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
	mag.setAttribute("stroke", "red");
	var points = [[xcor-5,ycor+5], [xcor+5,ycor-5], [xcor, ycor], [xcor+5,ycor+5], [xcor-5, ycor-5]];
	mag.setAttribute("points", points);
	
    }
    //going out of page
    
    else{
	mag = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    mag.setAttribute("stroke", "blue");
    mag.setAttribute("fill", "blue");
	mag.setAttribute("r", 2.5);
	mag.setAttribute("cx", xcor);
	mag.setAttribute("cy", ycor);
    }
    mag.setAttribute("stroke-width", 3);
    svg2.appendChild(mag);
    return mag;
};

var magfield;
//c: 1 up 0 down
var makeMagField = function(cols, rows, x1, x2, c1, c2) {
    magfield = new Array(cols);
    var d = (x1+x2)/2;
    var i;
    for (i = 0; i < magfield.length; i++) {
	xincrement = width / magfield.length
	magfield[i] = new Array(rows);
	var j;
	for (j = 0; j < magfield[i].length; j++){
	    yincrement = height / magfield[i].length;
	    var x = xincrement *i;
	    var y = height-yincrement*j;
	    if (x < d && x > x1+20){
		if (c1 < 0)
		    magfield[i][j] = makeMag(x, y, 1);
		else
		    magfield[i][j] = makeMag(x, y, 0);
	    }
	    else if (x < x1){
		if (c1 < 0)
		    magfield[i][j] = makeMag(x, y, 0);
		else
		    magfield[i][j] = makeMag(x, y, 1);
	    }
	    else if (x > d && x < x2){ 
		if (c2 < 0)
		    magfield[i][j] = makeMag(x, y, 0);
		else
		    magfield[i][j] = makeMag(x, y, 1);
	    }
	    else{
		if (c2 < 0)
		    magfield[i][j] = makeMag(x, y, 1);
		else
		    magfield[i][j] = makeMag(x, y, 0);
	    }
	    //magfield[i][j] = makeMag(xincrement * i, height - (yincrement * j), 0,0)
	}
    }
};

var left_current, right_current;

var leftSlider = document.getElementById("wire1");
var leftCurrent = document.getElementById("leftCurrent");
leftCurrent.innerHTML = leftSlider.value; // Display the default slider value
left_current = leftSlider.value;
leftSlider.oninput = function() {
    leftCurrent.innerHTML = this.value;
    left_current = this.value;
};
var rightSlider = document.getElementById("wire2");
var rightCurrent = document.getElementById("rightCurrent");
rightCurrent.innerHTML = rightSlider.value; // Display the default slider value
right_current = rightSlider.value;
rightSlider.oninput = function() {
    rightCurrent.innerHTML = this.value;
    right_current = this.value;
};

var distance;
var dslider = document.getElementById("dist");
var dist = document.getElementById("distance");
dist.innerHTML = dslider.value;
distance = parseInt(dslider.value);
dslider.oninput = function(){
    dist.innerHTML = this.value;
    distance = parseInt(this.value);
};

console.log(distance);
makeMagField(60, 20, 500-parseInt(distance), 500+parseInt(distance), left_current, right_current);
makeWires(500-parseInt(distance), 500+parseInt(distance));

var updateMagField = function(){
    var x1 = 500-distance;
    var x2 = 500+distance;
    var c1 = left_current;
    var c2 = right_current;
    var d = (x1+x2)/2;
    var i, j;
    while (svg2.lastChild) {
	svg2.removeChild(svg2.lastChild);
    }
    for (var x = 0; x < magfield.length; x++) {
	for (var y = 0; y < magfield[x].length; y++) {
            magfield[x][y] = 0;
	}

    }
    
    for (i = 0; i < magfield.length; i++) {
	xincrement = width / magfield.length;
	for (j = 0; j < magfield[i].length; j++){
	    yincrement = height / magfield[i].length;
	    var x = xincrement *i;
	    var y = height-yincrement*j;
	    if (x < d && x > x1+20){
		if (c1 < 0)
		    magfield[i][j] = makeMag(x, y, 1);
		else
		    magfield[i][j] = makeMag(x, y, 0);
	    }
	    else if (x < x1){
		if (c1 < 0)
		    magfield[i][j] = makeMag(x, y, 0);
		else
		    magfield[i][j] = makeMag(x, y, 1);
	    }
	    else if (x > d && x < x2){ 
		if (c2 < 0)
		    magfield[i][j] = makeMag(x, y, 0);
		else
		    magfield[i][j] = makeMag(x, y, 1);
	    }
	    else{
		if (c2 < 0)
		    magfield[i][j] = makeMag(x, y, 1);
		else
		    magfield[i][j] = makeMag(x, y, 0);
	    }
	    //magfield[i][j] = makeMag(xincrement * i, height - (yincrement * j), 0,0)
	}
    }
    makeWires(x1, x2);
};

var update = document.getElementById("update");
update.addEventListener("click", updateMagField);
//updateMagField();

/*
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
    //cir.setAttribute("click", function() { console.log(8); } )  ;
    cir.addEventListener("click", function(){
	wire_info.innerHTML = "Current of Selected Wire: " + cir.current;}
	);
    
    svg.appendChild(cir);
    wires.push(cir);
}
*/

/*
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
}*/



/////////////////FOR THE SLIDER
/*
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
*/

////////////DRAGGING STUFF

/*

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

*/
