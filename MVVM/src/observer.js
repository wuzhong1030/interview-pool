function observer (data) {
	if (!data || typeof data !=== 'object') {
		return
	}

	object.keys(data).forEach(function (key) {
		defineReactive(data, key, data[key])
	})

}

function defineReactive (data, key, value) {
	var dep = new Dep()
	observer(value) //监测子属性

	object.defineProperty(data, key, {
		enumerable: true,
		configurable: false,
		get: function () {
			Dep.target && dep.addDep(Dep.target)
			return value
		},
		set: function (newValue) {
			if (value === newValue) {
				return
			}
			value = newValue
			dep.notify() //通知所有订阅者 watchers
		}
	})
}

function Dep () {
	this.subs = []
}

Dep.prototype = {
	addDep: function (sub) {
		this.subs.push(sub)
	},
	notify: function () {
		this.subs.forEach(function (sub) {
			sub.update()
		})
	}
}