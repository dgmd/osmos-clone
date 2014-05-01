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
    this._velocity = velocity ? velocity : [Math.random()*0.5, Math.random()*0.5];

    // Create a DOM element for our blob and style it (though it isn't yet added)
	this._dom = document.createElement('div');
	this._dom.classList.add('blob');

	// Add our Blob to the Space
	this._space.addBlob(this);
}

// The largest mass we'll initialize a Blob randomly with; note the absence of
// Blob.prototype

Blob.defaultMaxMass = 7500 - 2500;

Blob.prototype.redrawBlob = function() {
	// As the state of our Blob changes, this is the function responsible for
	// changing its appearance

	// Position our Blob absolutely relative to our Space
	this._dom.style.position = 'absolute';

	// Put the center of our Blob at its position
	this._dom.style.left = this.position[0] - this.radius;
	this._dom.style.top = this.position[1] - this.radius;

	// Set the size of our Blob and make it a circle
	this._dom.style.width  = 2 * this.radius;
	this._dom.style.height = 2 * this.radius;
	this._dom.style.borderRadius = 1.05*this.radius; // Make it a circle, rounding up so the radius is > 50%

	// Set a background-color ranging from pure red to pure blue depending on
	// its size relative to Blob.defaultMaxMass
	var backgroundColor = 'rgb(' + [
        255 * (1 - this.mass / Blob.defaultMaxMass),
        0,
        255 * (this.mass / Blob.defaultMaxMass)
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
	get: function() { return Blob.radiusFromMass(this.mass); }
});


/*****************************************************************************
* Handling our Mass
*/

Object.defineProperty(Blob.prototype, 'mass', {
	get: function() { return this._mass; },
	set: function(m) {
		this._mass = m;
		if (this._mass < 0) {
			console.log(this, "died!");
			this._space.removeBlob(this);
		}
	}
});


/*****************************************************************************
* Handling our Position
*/

Object.defineProperty(Blob.prototype, 'position', {
	get: function() { return this._position; },
	set: function(p) { this._position = p; }
});



/*****************************************************************************
* Handling our Velocity
*/

Object.defineProperty(Blob.prototype, 'velocity', {
	get: function() { return this.getVelocity(); },
	set: function(m) { this.setVelocity(m); }
});

Blob.prototype.getVelocity = function() { return this._velocity; };
Blob.prototype.setVelocity = function(velocity) {
	if (norm(velocity) !== 0) { this._direction = angleOf(this.velocity); }
	this._velocity = velocity;
	this._dom.style.webkitTransform = 'rotate(' + this.direction + 'deg)';
};



/*****************************************************************************
* Handling our Direction
*/

Object.defineProperty(Blob.prototype, 'direction', {
	get: function() { return this.getDirection(); },
	set: function(degrees) { this.setDirection(degrees); }
});

Blob.prototype.getDirection = function() { return toDegrees(this._direction); };
Blob.prototype.setDirection = function(degrees) {
	var speed = norm(this.velocity);
	var newDirectionUnitVector = unitVector([Math.cos(toRadians(degrees)), Math.sin(toRadians(degrees))]);
	this.velocity = newDirectionUnitVector.map(function(v) { return v*speed; });
};



/*****************************************************************************
* Moving our Blob
*/

Blob.prototype.moveTo = function(xy) {
	// If we need to bounce, we'll multiply our velocity by this, if we don't,
	// we'll just be multiplying by 1
	var bounce = [1, 1];

	var blob = this;	// When we're using map, 'this' gets rebound, so we save
						// an easy to use pointer to it

	var newPosition = xy.map(function(c, i) {
		// Calculate our new postion, but if it's out of bounds, go as far as we
		// can and alter bounce

		if (c - blob.radius < 0) {
			// Too small?
			bounce[i] = -1;
			return blob.radius;
		}
		else if (c + blob.radius > blob._space._size) {
			// Too big?
			bounce[i] = -1;
			return blob._space._size - blob.radius;
		}
		else {
			return c;
		}
	});

	// Modify our velocity with our bounce factor
	var newVelocity = this.velocity.map(function(v, i) { return v*bounce[i]; });

	// Actually update our position, velocity
	this.position = newPosition;
	this.velocity = newVelocity;

	// For convenience, return our position
	return this.position;
};



/*****************************************************************************
* Ejecting Blob(s)
*/

Blob.prototype.eject = function(mass, speed, degrees) {
	if (mass > this.mass) { throw "Ejecting more mass than " + this + " has!"; }

	var ejectaRadius = Blob.radiusFromMass(mass);
	var ejectaPosition = [
		this.position[0] + Math.cos(toRadians(degrees))*(this.radius + ejectaRadius),
		this.position[1] + Math.sin(toRadians(degrees))*(this.radius + ejectaRadius)
	];

	var ejectaDirection = this.position.map(function(c, i) { return c - ejectaPosition[i]; });
	var ejectaVelocity = unitVector(ejectaDirection).map(function(v) { return -1*speed*v; });

	var ejecta = new Blob(this._space, mass, ejectaPosition, ejectaVelocity);

	this.mass -= ejecta.mass;
	this.velocity = this.velocity.map(function(v, i) {
		// Adjust the velocity by the mass and velocity of our ejecta
		return v - ejectaVelocity[i]*ejecta.mass/this.mass*5; },
		this	);

	return ejecta;
};



/*****************************************************************************
* Simulating our Blob(s)
*/

Object.defineProperty(Blob.prototype, 'overlappers', {
	// Create an accessor which finds all blobs in the space overlapping with u
	get: function() {
		var overlappers = [];
		this._space._blobs.forEach(function(blob) {
			if (
				(distance(this.position, blob.position) < this.radius + blob.radius) && // if it's too close
				blob != this) { // and not us
					overlappers.push(blob); // add the overlapper to the list
			}},
			this);

		return overlappers;
		}
	}
);

Blob.prototype.simulate = function(dt) {
	this.overlappers.forEach(function(overlapper) {
		if (overlapper.mass > this.mass) {
			// Add the growing/shrinking logic to simulation--
			this.mass -= 10;
			overlapper.mass += 10;
		}
	}, this);

	var newPosition = this.position.map(function(xy, i) {
		return xy + this.velocity[i]*dt;
	}, this);
	this.moveTo(newPosition);
};