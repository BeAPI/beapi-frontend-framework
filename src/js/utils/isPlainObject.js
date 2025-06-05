/*!
 * isPlainObject <https://stackoverflow.com/questions/18531624/isplainobject-thing>
 *
 * Copyright https://stackoverflow.com/users/6023279/trunow.
 */

export default function isPlainObject(o) {
	return o?.constructor === Object || Object.getPrototypeOf(o ?? 0) === null
}
