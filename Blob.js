function Blob(space, mass, position, velocity) {
    this._space = space ? space : new Space(); // Find our Space

    // Define our mass
    this._mass = mass ? mass : Math.random() * Blob.defaultMaxMass + 2500;

    // Place our Blob randomly in our Space if we don't pass a position
    var r = this.radius;
    var innerWidth = this._space._width - 2 * r;
    this._position = position ? position : [0, 0].map(
        function(x) {
            return r + Math.random() * innerWidth;
        });

    // If we don't have a velocity, initialize it as [0, 0]
    this._velocity = velocity ? velocity : [0, 0];

    // Create a DOM element for our blob and style it (though it isn't yet added)
	this._dom = document.createElement('div');
	this._dom.classList.add('blob');
	this.redrawBlob();

	// Add our Blob to the Space
	this._space.addBlob(this);
}

// The largest mass we'll initialize a Blob randomly with; note the absence of 
// Blob.prototype

Blob.defaultMaxMass = 10000;

Blob.prototype.redrawBlob = function() {
	// As the state of our Blob changes, this is the function responsible for 
	// changing its appearance

	// Position our Blob absolutely relative to our Space
	this._dom.style.position = 'absolute';

	// Put the center of our Blob at its position
	this._dom.style.left = this.getPosition()[0] - this.radius;
	this._dom.style.top = this.getPosition()[1] - this.radius;

	// Set the size of our Blob and make it a circle
	this._dom.style.width  = 2 * this.radius;
	this._dom.style.height = 2 * this.radius;
	this._dom.style.borderRadius = this.radius; // Make it a circle

	// Set a background-color ranging from pure red to pure blue depending on
	// its size relative to Blob.defaultMaxMass
	var backgroundColor = 'rgb(' + [
        255 * (1 - this.getMass() / Blob.defaultMaxMass),
        0,
        255 * (this.getMass() / Blob.defaultMaxMass)
        ].map(Math.round).join(',') + ')';
	this._dom.style.backgroundColor =  backgroundColor;
};


/*****************************************************************************
* Handling our Radius
*/

Blob.radiusFromMass = function (mass) {
	// To go from mass to radius; note the absence of .prototype; this is a
	// class method which we'll sometimes use while creating an instance
	return Math.sqrt(mass / Math.PI);
};

// Defining accessor interface
Object.defineProperty(Blob.prototype, 'radius', {
	get: function() { return this.getRadius(); }
});

// Defining our base accessor
Blob.prototype.getRadius = function() {
	return Blob.radiusFromMass(this.getMass());
};