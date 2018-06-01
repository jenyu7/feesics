

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

var svg = document.getElementById("vimage");



//var vector = {xmag:"500", color:"white"};
var vector_field;

var makeVector = function(xmag, ymag) {
    return {xmag: xmag, ymag: ymag}
};

var makeVectorField = function(cols, rows) {
    vector_field = new Array(cols);
    var i;
    for (i = 0; i < vector_field.length; i++) { 
	vector_field[i] = new Array(rows);
	var j;
	for (j = 0; j < vector_field[i].length; j++){
	    vector_field[i][j] = makeVector(0,0)
	}
    }
};

makeVectorField(10, 20);
console.log(vector_field);


/////////////////FOR THE SLIDER
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
 
