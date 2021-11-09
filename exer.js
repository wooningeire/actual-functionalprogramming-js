// exercises from https://gist.github.com/oskarkv/3168ea3f8d7530ccd94c97c19aafe266

// clist
//const clist = Array.of;
const clist = (...items) => [...items];

// add, sub
const add = (...addends) => addends.reduce((value, addend) => value + addend);
const sub = (...numbers) => numbers.length === 0
		? -numbers[0]
		: numbers[0] - add(...numbers.slice(1));

// compose
const compose2 = (callback1, callback0) =>
	(...args) => callback1(callback0(...args));

// compose with varargs
const compose = (...callbacks) =>
		(...args) => callbacks.reduceRight((value, callback) => [callback(...value)], args)[0];

// zip
const zip = (...arrays) => arrays[0]?.map((item, i) => arrays.map(array => array[i])) ?? [];

// zipmap
const zipmap = (keys, values) => keys.reduce((resultObject, key, i) => ({...resultObject, [key]: values[i]}), {});

// zipwith
const zipwith = (callback, ...arrays) => zip(...arrays).map(set => callback(...set));

// car and cdr
const car = pair => pair((item0, item1) => item0);
const cdr = pair => pair((item0, item1) => item1);

// partial
const partial = (callback, ...prepackedArgs) =>
		(...incomingArgs) => callback(...prepackedArgs, ...incomingArgs);

// transpose
const transpose = arrays => zip(...arrays);

// flip
const flip = callback =>
		(...args) => callback(args[1], args[0], ...args.slice(2));

// flips
const flips = callback =>
		(...args) => callback(...args.reverse());

// take
const take = (nItems, iterable) => {
	const iterator = iterable[Symbol.iterator]();
	return new Array(nItems).fill().map(() => iterator.next().value);
};

// drop
const drop = (nItems, iterable) => {
	const iterator = iterable[Symbol.iterator]();
	new Array(nItems).fill().forEach(() => iterator.next());
	return [...iterator];
};

// flatten
//const flatten = arrayTree => arrayTree.flat(Infinity);
const flatten = arrayTree => arrayTree.reduce((resultArray, item) => Array.isArray(item) 
		? [...resultArray, ...flatten(item)]
		: [...resultArray, item],
[]);

// interleave
const interleave = compose(flatten, zip);

// every_pred
/* const everyPred = (...predicates) =>
		arg => predicates.every(predicate => predicate(arg)); */
const everyPred = (...predicates) =>
		arg => predicates.reduce((result, predicate) => result && predicate(arg), true);

// frequencies
const frequencies = array => array.reduce((frequencyDict, item) => ({...frequencyDict, [item]: (frequencyDict[item] ?? 0) + 1}), {});

// partition
const partition = (nItems, step, array) =>
		array.reduce((resultArray, item, itemIndex) => itemIndex % step !== 0 || itemIndex + nItems > array.length
				? resultArray
				: [...resultArray, new Array(nItems).fill().map((item, i) => array[itemIndex + i])], []);

// merge_with
const mergeWith = (callback, ...dicts) =>
		Object.fromEntries(Object.entries(dicts.reduce((resultDict, dict) =>
				Object.entries(dict).reduce((intermediateDict, [key, value]) => resultDict.hasOwnProperty(key)
						? {...intermediateDict, [key]: [...intermediateDict[key], value]}
						: {...intermediateDict, [key]: [value]},
				resultDict),
		{})).map(([key, instances]) => instances.length > 1
				? [key, callback(...instances)]
				: instances[0]));

// tree_seq
const treeSeq = (isBranch, sourceToTree, treeSource) => {
	const tree = sourceToTree(treeSource);
};

// memoize
const memoize = (() => {
	const mapSetReturn = (map, key, value) => (map.set(key, value), value);

	return callback => {
		const memo = new Map();

		return (...args) => {
			const argsWithLength = [args.length, ...args];

			const lastMap = argsWithLength.slice(0, -1).reduce((currentMap, arg) => currentMap.has(arg)
					? currentMap.get(arg)
					: mapSetReturn(currentMap, arg, new Map()), memo);

			const lastArg = argsWithLength[argsWithLength.length - 1];

			return lastMap.has(lastArg)
					? lastMap.get(lastArg)
					: mapSetReturn(lastMap, lastArg, callback(...args));
		};
	};
})();

// group_by
const groupBy = (hasher, items) =>
		items.reduce((resultDict, item) => {
			const hash = hasher(item);
			return resultDict.hasOwnProperty(hash)
					? {...resultDict, [hash]: [...resultDict[hash], item]}
					: {...resultDict, [hash]: [item]};
		}, {});

// update
const update = (dict, key, callback, ...args) => dict.hasOwnProperty(key)
		? {...dict, [key]: callback(dict[key], ...args)}
		: {...dict, [key]: callback(...args)};

// update_in
const updateIn = (dict, keyPath, callback, ...args) => keyPath.length === 0
		? {...dict}
		: keyPath.length === 1
				? update(dict, keyPath[0], callback, ...args)
				: {...dict, [keyPath[0]]: updateIn(dict[keyPath[0]], keyPath.slice(1), callback, ...args)};

// balanced
const balanced = (() => {
	const openers = new Set("([{");
	const closers = new Map([
		[")", "("],
		["]", "["],
		["}", "{"],
	]);

	return string => {
		const state = [...string].reduce(({matched, bracketStack}, char) => !matched
				? {matched, bracketStack}
				: closers.has(char)
						? bracketStack[bracketStack.length - 1] === closers.get(char)
								? {matched, bracketStack: bracketStack.slice(0, -1)}
								: {matched: false, bracketStack: []}
						: openers.has(char)
								? {matched, bracketStack: [...bracketStack, char]}
								: {matched, bracketStack},
		{
			matched: true,
			bracketStack: [],
		});

		return state.matched && state.bracketStack.length === 0;
	};
})();

// postwalk, prewalk


// Recreate map, filter, and reduce

{
	const arrayEqualsDeep = (array0, array1) =>
			array0
			&& array1
			&& array0.length === array1.length
			&& array0.every((item, i) =>
					item === array1[i]
					|| (Array.isArray(item) && arrayEqualsDeep(item, array1[i]))
			);

	const dictEqualsDeep = (dict0, dict1) =>
			dict0
			&& dict1
			&& Object.entries(dict0).every(([key, value], i) =>
					(dict1.hasOwnProperty(key) && value === dict1[key])
					|| (typeof value === "object" && dictEqualsDeep(value, dict1[key]))
			);

	const curry = (callback, ...prepackedArgs) =>
			(...incomingArgs) => prepackedArgs.length + incomingArgs.length < callback.length
					? curry(callback, ...prepackedArgs, ...incomingArgs)
					: callback(...prepackedArgs, ...incomingArgs);

	const assertEqualCallback = callback => 
			curry((item0, item1, label) => {
				console.assert(callback(item0, item1), label, item0, item1);
			});

	const assertEqual = assertEqualCallback((item0, item1) => item0 === item1);
	const assertArraysEqual = assertEqualCallback(arrayEqualsDeep);
	const assertDictsEqual = assertEqualCallback(dictEqualsDeep);

	const test = () => {
		assertArraysEqual(clist(1, 2, 3), [1, 2, 3])("clist");

		assertEqual(add(1, 2, 3), 6)("add");
		assertEqual(sub(5, 1, 2), 2)("sub");

		const double = x => x * 2;
		const negate = x => -x;
		assertEqual(compose2(double, negate)(3), -6)("compose2");

		assertEqual(compose(negate, double, add)(1, 2, 3), -12)("compose");
		assertArraysEqual(compose(clist, double, sub)(1, 2, 3), [-8])("compose");

		assertArraysEqual(zip([1, 2, 3], [4, 5, 6]), [[1, 4], [2, 5], [3, 6]])("zip");
		assertArraysEqual(zip([1, 2, 3], [4, 5, 6], [7, 8, 9]), [[1, 4, 7], [2, 5, 8], [3, 6, 9]])("zip");
		
		const cons = (item0, item1) =>
				callback => callback(item0, item1);
		assertEqual(car(cons(3, 4)), 3)("car");
		assertEqual(cdr(cons(3, 4)), 4)("cdr");

		assertEqual(partial(add, 1, 2)(3, 4), 10)("partial");
		assertArraysEqual(partial(clist, 1, 2)(3, 4), [1, 2, 3, 4])("partial");
		assertEqual(partial(sub, 10)(1, 2), 7)("partial");

		assertArraysEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]])("transpose");
	
		assertArraysEqual(flip(clist)(1, 2, 3), [2, 1, 3])("flip");
		assertEqual(flip(sub)(10, 1), -9)("flip");
		
		assertArraysEqual(flips(clist)(1, 2, 3), [3, 2, 1])("flips");
		assertEqual(flips(sub)(1, 2, 3), 0)("flips");

		const range = end =>
				new Array(end).fill().map((item, i) => i);
		assertArraysEqual(take(3, range(10)), [0, 1, 2])("take");

		assertArraysEqual(drop(3, range(6)), [3, 4, 5])("drop");

		assertArraysEqual(flatten([1, [2, [3, 4], [5, 6], 7], 8, [9, 10]]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("flatten");

		assertArraysEqual(interleave([1, 2, 3], [10, 20, 30]), [1, 10, 2, 20, 3, 30])("interleave");
		assertArraysEqual(interleave([1, 2, 3], [10, 20, 30], "abc"), [1, 10, "a", 2, 20, "b", 3, 30, "c"])("interleave");

		const positive = x => x > 0;
		const even = x => x % 2 === 0;
		assertEqual(everyPred(positive, even)(8), true)("everyPred");
		assertEqual(everyPred(positive, even)(7), false)("everyPred");

		assertDictsEqual(frequencies([..."aabcbcac"]), {a: 3, c: 3, b: 2})("frequencies");
		assertDictsEqual(frequencies([1, 2, 2, 2]), {1: 1, 2: 3})("frequencies");

		assertArraysEqual(partition(3, 1, [1, 2, 3, 4, 5]), [[1, 2, 3], [2, 3, 4], [3, 4, 5]])("partition");

		const newAdd = memoize(add);
		assertEqual(newAdd(1, 2, 3), 6)("memoize");
		assertEqual(newAdd(1, 2, 3), 6)("memoize");

		const len = string => string.length;
		assertDictsEqual(groupBy(len, ["hi", "dog", "me", "bad", "good"]), {2: ["hi", "me"], 3: ["dog", "bad"], 4: ["good"]})("groupBy");

		assertDictsEqual(update({name: "bob", hp: 3}, "hp", add, 2), {name: "bob", hp: 5})("update");
		assertDictsEqual(update({name: "bob"}, "hp", add, 2), {name: "bob", hp: 2})("update");

		const object = {a: 1, b: {c: 2, d: {e: 3}}};
		assertDictsEqual(updateIn(object, ["b", "d", "e"], add, 10), {"a": 1, "b": {"c": 2, "d": {"e": 13}}})("updateIn");
		assertDictsEqual(updateIn(object, ["b", "d", "f"], add, 10), {"a": 1, "b": {"c": 2, "d": {"e": 3, "f": 10}}})("updateIn");

		assertEqual(balanced("abc(def{g}hi[jk]((()))l)m"), true)("balanced");
		assertEqual(balanced("a(b"), false)("balanced");
		assertEqual(balanced("([)]"), false)("balanced");

		const wrapUnlessZero = arg => arg === 0 ? arg : [arg - 1];
	};
	test();
}