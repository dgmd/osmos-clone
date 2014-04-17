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