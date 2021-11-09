export const curry = (callback, ...prepackedArgs) =>
		(...incomingArgs) => prepackedArgs.length + incomingArgs.length < callback.length
				? curry(callback, ...prepackedArgs, ...incomingArgs)
				: callback(...prepackedArgs, ...incomingArgs);

export const pipe = (...callbacks) =>
		(...args) => callbacks.reduce((value, callback) => [callback(...value)], args)[0];

export const compose = (...callbacks) =>
		(...args) => callbacks.reduceRight((value, callback) => [callback(...value)], args)[0];