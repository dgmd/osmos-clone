function Space(dom, size) {
	this._dom = dom ? dom : document.getElementById('space');
	this._size = size ? size : this._dom.offsetWidth;
	this._width = this._size;
	this._height = this._size;

	this._dom.style.width = this._width;
	this._dom.style.height = this._height;

	this._blobs = []; // We'll use this array to store all the blobs we have
}

Space.prototype.addBlob = function(blob) {
	this._blobs.push(blob);
	this._dom.appendChild(blob._dom);

	return blob;
};

Space.prototype.removeBlob = function(blob) {
	this._dom.removeChild(blob._dom); // remove the blob from our DOM
	this._blobs.splice(this._blobs.indexOf(blob), 1); // & then stop tracking it
};

Space.prototype.update = function(dt) {
	this._blobs.map(function(b) {
		b.simulate(dt);
		b.redrawBlob();
	});
};