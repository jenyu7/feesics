var wire_current = 1; //or -1

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
svg.addEventListener("click", function(e){addWire(e); updateVectors(e); } );


//var vector = {xmag:"500", color:"white"};
var vector_field;

var makeVector = function(xcor, ycor, xmag, ymag) {
    var vector = document.createElementNS("http://www.w3.org/2000/svg", "line");

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

	var dist = Math.sqrt( ydist*ydist + xdist*xdist );
	
	var distAngle = Math.atan(ydist / xdist);
	
	var ymagchange = ( current * Math.sin(distAngle) ) / (dist * dist)
	var xmagchange = ( current * Math.cos(distAngle) ) / (dist * dist)
	
	vector.xmag += xmagchange;
	vector.ymag += ymagchange;
	
	//console.log(vector.xmag, vector.ymag);
	//console.log(angle);
	if (isNaN( Math.atan(vector.ymag / vector.xmag) )) {
	    angle = 0;
	} else {
	    angle = Math.atan(vector.ymag / vector.xmag) * (180 / Math.PI);
	};
	//console.log(angle);
	vector.setAttribute("transform", 'rotate(' + angle + ' ' + vector.xcor + ' ' + vector.ycor + ')' );
    };
    
    var radius = 15;
    //var vector = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vector.setAttribute("x1", xcor - radius);
    vector.setAttribute("y1", ycor );
    vector.setAttribute("x2", xcor + radius);
    vector.setAttribute("y2", ycor );
    vector.setAttribute("stroke-width", 1);
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

makeVectorField(25, 15);
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
    cir.setAttribute("cy", e.offsetY);
    cir.setAttribute("r", 10);
    cir.setAttribute("fill", "blue");
    cir.setAttribute("stroke", "black");
    cir.current = wire_current;
    //so far this next line just prints the xcor of the vector
    cir.setAttribute("onclick", 'console.log(" this is a wire ",' + cir.current + ')' );
    svg.appendChild(cir)
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



/////////////////FOR THE SLIDER
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
 
