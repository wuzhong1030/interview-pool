;(function () {
	var JQuery = window.JQuery = window.$ = function (selector) {
		return new JQuery.fn.init(selector)
	}

	JQuery.fn.prototype = {
		init: function (selector) {
			var element = document.getElementByTagName(selector)
			Array.prototype.push.call(this, element)
			return this
		},
		version: '1.0.0',
		length: 0,
		size: function () {
			return this.length
		}
	}

	JQuery.fn.init.prototype = JQuery.fn

	JQuery.fn.extend = function () {
		var o = arguments[0]
		for (var p in o) {
			this[p] = o[p]
		}
	}

})()