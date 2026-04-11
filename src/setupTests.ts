
// Garante jsdom em ambientes CI onde document/window podem não estar definidos
import { JSDOM } from 'jsdom';
if (typeof window === 'undefined' || typeof document === 'undefined') {
	const dom = new JSDOM('<!doctype html><html><body></body></html>');
	// @ts-expect-error jsdom: window não existe no Node
	global.window = dom.window;
	global.document = dom.window.document;
	// Copia propriedades úteis do window para global
	Object.getOwnPropertyNames(dom.window).forEach((prop) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const g = global as any;
		if (typeof g[prop] === 'undefined') {
			try {
				g[prop] = dom.window[prop];
			} catch (e) {
				// Propriedade read-only, ignora
			}
		}
	});
}

