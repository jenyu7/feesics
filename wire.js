

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


svg.addEventListener("click", function(e){console.log(e.offsetX, e.offsetY);} );


//var vector = {xmag:"500", color:"white"};
var vector_field;

var makeVector = function(xcor, ycor, xmag, ymag) {
    return {xcor: xcor,
	    ycor: ycor,
	    xmag: xmag,
	    ymag: ymag,
	    addtoY: function(newymag){ ymag += newymag; },
	    addtoX: function(newxmag){ xmag += newxmag; },
	    addVector : function(newX, newY){ addtoX(newX); addtoY(newY); },
	    display : function() {
		var cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		cir.setAttribute("cx", xcor);
		cir.setAttribute("cy", ycor);
		cir.setAttribute("r", 10);
		cir.setAttribute("fill", "blue");
		cir.setAttribute("stroke", "black");
		//so far this next line just prints the xcor of the vector
		cir.setAttribute("onclick", 'console.log(' + xcor + ')' );
		svg.appendChild(cir)
	    }
	   }
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

makeVectorField(20, 10);
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
displayVectors();
	

/////////////////FOR THE SLIDER
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
 
