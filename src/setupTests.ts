
// Garante jsdom em ambientes CI onde document/window podem não estar definidos
import { JSDOM } from 'jsdom';
if (typeof globalThis.window === 'undefined' || typeof globalThis.document === 'undefined') {
	const dom = new JSDOM('<!doctype html><html><body></body></html>');
	// @ts-expect-error jsdom: window não existe no Node
	globalThis.window = dom.window;
	globalThis.document = dom.window.document;
	// Copia propriedades úteis do window para globalThis
	Object.getOwnPropertyNames(dom.window).forEach((prop) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const g = globalThis as any;
		if (g[prop] === undefined) {
			try {
				g[prop] = dom.window[prop];
			} catch (e) {
				// Propriedade read-only, ignora apenas se for erro de escrita
				if (!(e instanceof TypeError)) throw e;
			}
		}
	});
}

// Mock window.scrollTo para evitar erro "Not implemented: window.scrollTo" nos testes
if (typeof globalThis.window !== 'undefined' && !globalThis.window.scrollTo) {
	globalThis.window.scrollTo = () => {};
}

