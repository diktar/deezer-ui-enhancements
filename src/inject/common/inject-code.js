(() => {
	window.injectCode = function(func, args) {
		let script = document.createElement('script');

		script.textContent =
			'try {(' + func + ')(' + (args || []).map(t =>"'" + t + "'") + '); } ' +
			'catch(e) {console.error("injected error", e);};';

		(document.head || document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
	};
})()