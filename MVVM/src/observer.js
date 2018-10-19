function observer(data, vm) {
    if (!data || typeof data !== 'object') {
        return
    }

    return new Observer(data)

    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key])
    })

}

function Observer(data) {
    this.data = data
    this.walk(data)
}

Observer.prototype = {
    walk: function(data) {
        var self = this
        Object.keys(data).forEach(function(key) {
            self.convert(key, data[key])
        })
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val)
    },
    defineReactive(data, key, value) {
        var dep = new Dep()
        var childObj = observer(value) //监测子属性

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                if (Dep.target) {
                	dep.depend()
                }
                return value
            },
            set: function(newValue) {
                if (value === newValue) {
                    return
                }
                value = newValue
                childObj = observer(newValue)
                dep.notify() //通知所有订阅者 watchers
            }
        })
    }
}

var uid = 0

function Dep() {
	this.id = uid++
    this.subs = []
}

Dep.prototype = {
	addSub: function (sub) {
		this.subs.push(sub)
	},
    depend: function () {
    	Dep.target.addDep(this)
    },
    removeSub: function (sub) {
    	var index = this.subs.indexOf(sub)
    	if (index !== -1) {
    		this.subs.splice(index, 1)
    	}
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update()
        })
    }
}