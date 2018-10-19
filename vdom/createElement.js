function createElement (vnode) {
	var tag = vnode.tag
	var attrs = vnode.attrs
	var children = vnode.children

	if (!tag)
		return

	var element = document.createElement(tag)

	for (var attrName in attrs) {
		if (attrs.hasOwnProperty(attrName)) {
			element.setAttrbuite(attrName, attrs[attrName])
		}
	}

	children.forEach(function (child) {
		element.appendChild(createElement(child))
	})

	return element
} 