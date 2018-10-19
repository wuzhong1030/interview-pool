function MVVM (options) {
	this.$options = options
	var data = this._data = this.$options.data
	var self = this

	Object.keys(data).forEach(function (key) {
		self._proxy(key)
	})

	observer(data, this)
	this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
	_proxy: function (key) {
		var self = this
		Object.defineProperty(self, key, {
			enumerable: true,
			configurable: false,
			get: function proxyGetter () {
				return self._data[key]
			},
			set: function proxySetter (newVal) {
				self._data[key] = newVal
			}
		})
	}
}