import { ATTR_KEY } from '../constants';
import { toLowerCase } from '../util';
import { diffAttributes } from '../vdom/diff';
import { removeNode } from './index';

/** DOM node pool, keyed on nodeName. */

const nodes = {};

export function collectNode(node) {
	removeNode(node);

	if (node instanceof Element) {
		node._component = node._componentConstructor = null;
		diffAttributes(node, {}, node[ATTR_KEY]);

		// let attrs = node[ATTR_KEY];
		// if (attrs) {
		// 	node._component = node._componentConstructor = null;
		// 	diffAttributes(node, {}, attrs);
		// }

		let name = node.normalizedNodeName || toLowerCase(node.nodeName);
		(nodes[name] || (nodes[name] = [])).push(node);
	}
}


export function createNode(nodeName, isSvg) {
	let name = toLowerCase(nodeName),
		node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
	node.normalizedNodeName = name;
	return node;
}
