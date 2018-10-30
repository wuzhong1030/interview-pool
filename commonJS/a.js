let num = 1
let obj = {
	name: 'aaaa'
}

setTimeout(function () {
	console.log(num)
	console.log(obj.name)
}, 1000)

module.exports = {
	num, obj
}