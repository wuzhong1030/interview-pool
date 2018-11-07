function createEle (vnode) {
	var tag = vnode.tag
	var attrs = vnode.attrs
	var children = vnode.children

	if (!tag)
		return

	var element = document.createElement(tag)
	console.log(element)

	for (var attrName in attrs) {
		if (attrs.hasOwnProperty(attrName)) {
			element.setAttribute(attrName, attrs[attrName])
		}
	}

	children.forEach(function (child) {
		element.append(createEle(child))
	})

	return element
} 