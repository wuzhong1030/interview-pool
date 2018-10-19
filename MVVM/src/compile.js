function Compile (el, vm) {
	this.$vm = vm
	this.$el = this.isElementNode(el) ? el : document.querySelector(el)
	if (this.$el) {
		this.$fragment = this.node2Fragment(this.$el)
		this.init()
		this.$el.appendChild(this.$fragment)
	}
}

Compile.prototype = {
	init: function () {
		this.compileElement(this.$fragment)
	},
	node2Fragment: function (el) {
		var fragment = document.createDocumentFragment(),
			child

		while (child = el.firstChild) {
			fragment.appendChild(child)
		}

		return fragment
	},
	compileElement: function  (el) {
		var childNodes = el.childNodes
		var self = this;
		[].slice.call(childNodes).forEach(function (node) {
			var text = node.textContent
			var reg = /\{\{(.*)\}\}/
			if (self.isElementNode(node)) {
				self.compile(node)
			} else if (self.isTextNode(node) && reg.test(text)) {
				self.compileText(node, RegExp.$1)
			}
			// 遍历编译子节点
			if (node.childNodes && node.childNodes.length) {
				self.compileElement(node)
			}
		})
	},
	compile: function (node) {
		var nodeAttrs = node.attributes
		var self = this;
		[].slice.call(nodeAttrs).forEach(function (attr) {
			// 指令以 v-text 命名
			var attrName = attr.name
			if (self.isDirective(attrName)) { // v-text
				var exp = attr.value //content
				var dir = attrName.substring(2) // text or on:click
				if (self.isEventDirective(dir)) {
					compileUtil.eventHandle(node, this.$vm, exp, dir)
				} else {
					compileUtil[dir] && compileUtil[dir](ndoe, this.$vm, exp)
				}
			}
		})
	},
	compileText: function (node, exp) {
		compileUtil.text(node, this.$vm, exp)
	},

	isElementNode: function (node) {
		return node.nodeType === 1
	},
	isTextNode: function (node) {
		return node.nodeType === 3
	},
	isDirective: function (attr) {
		return attr.indexOf('v-') === 0
	},
	isEventDirective: function (dir) {
		return dir.indexOf('on') === 0
	}
}

// 指令处理
var compileUtil = {
	text: function (node, vm, exp) {
		this.bind(node, vm, exp, 'text')
	},
	html: function (ndoe, vm, exp) {
		this.bind(node, vm, exp, 'html')
	},
	mode: function (node, vm, exp) {
		this.bind(node, vm, exp, 'mode')
		var self = this,
			val = this._getVMVal(vm, exp)
		node.addEventListener('input', function (e) {
			var newVal = e.target.value
			if (val === newVal) {
				return
			}
			self._setVMVal(vm, exp, newVal)
			val = newVal
		})

	},
	class: function (node, vm, exp) {
		this.bind(node, vm, exp, 'class')
	},
	bind: function (node, vm, exp, dir) {
		var updaterFn = updater[dir + 'Updater']
		updaterFn && updaterFn(node, this._getVMVal(vm, exp))

		new Watcher(vm, exp, function (value, oldValue) {
			updaterFn && updaterFn(node, value, oldValue)
		})
	},

	// 事件处理
	eventHandle: function (node, vm, exp, dir) {
		var eventType = dir.split(':')[1],
			fn = vm.$options.methods && vm.$options.methods[exp]

		if (eventType && fn) {
			node.addEventListener(eventType, fn.bind(vm), false)
		}

	},

	_getVMVal: function (vm, exp) {
		var val = vm
		console.log(val)
		exp = exp.split('.')
		exp.forEach(function (k) {
			val = val[k]
		})
		return val
	},
	_setVMVal: function (vm, exp, value) {
		var val = vm
		exp = exp.split('.')
		exp.forEach(function (k, i) {
			// 非最后一个key, 更新val的值
			if (i < exp.length -1) {
				val = val[k]
			} else {
				val[k] = value
			}
		})
	}
}

// 更新函数
var updater = {
	textUpdater: function (node, value) {
		node.textContent = typeof value === 'undefined' ? '' : value
	},
	htmlUpdater: function (node, value) {
		node.innerHTML = typeof value === 'undefined' ? '' : value
	},
	classUpdater: function (node, value, oldValue) {
		var className = node.className
		className = className.replace(oldValue, '').replace(/\s$/, '')
		var space = className && String(value) ? ' ' : ''
		node.className = className + space + value
	},
	modeUpdater: function (node, value, oldValue) {
		node.value = typeof value === 'undefined' ? '' : value
	}
}

