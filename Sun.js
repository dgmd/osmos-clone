function Sun(space) {
  // In defining our new class, we initialize all the Blob attributes as we'd like Suns to be uniquely constructed
  this.space = space;

  this.velocity = [0,0]; // Our Sun never moves
  this.mass = 5000; // and always hass this mass
  this.position = [space._width/2.0, space._height/2.0]; // and is in the middle of our Space

  space.addBlob(this);
  // Note that we needed to move where the Blob is added to the Space so that in inheriting the Blob, we didn't have to _construct_ it at inheritance time.
}

Sun.prototype = new Blob(); // Copy the rest of the recipe associated with a Blob, pre-existing attributes are _not_ over-written


Object.defineProperty(Sun.prototype, 'overlappers', {
  // We don't want our Sun to grow/shrink, so we redefine overlappers to return nothing
  get: function() { return []; }
  }
);

Object.defineProperty(Sun.prototype, 'mass', {
  // We don't want our Sun to grow/shrink, so we prevent the mass accessors from running, as well
  get: function() { return this._mass; },
  set: function () { }
  }
);

Sun.prototype.simulate = function() {
  // During each step in the Space's simulate loop, the Sun searches for all other Blobs and adjusts their velocity, pulling them toward it

  var otherBlobs = this.space._blobs.filter(function(b) { return b != this; }, this); // find all Blobs not this Sun
  otherBlobs.forEach(function(b) { // for each of them
    // Find the direction vector connecting us
    var direction = unitVector(this.position.map(function(c, i) { return c - b.position[i]; }));

    // And subtract a bit from the blob's direction accordingly
    b.velocity = b.velocity.map(function(v, i) {
      return v + Math.abs(direction[i]*0.001);
    });
  }, this);
};