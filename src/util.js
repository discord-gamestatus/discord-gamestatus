/* Polyfill for Promise.allSettled as it is not supported until Node v12.9.0 */
exports.allSettled = function(promises) {
  var count = 0, size = promises.length, responses = new Array(size);
  return new Promise((resolve) => {
    if (size === 0) return resolve([]);
    for (let i=0;i<size;i++) {
      let onFufilled = function() {
        let res = Array.from(arguments);
        if (res.length === 0) res = undefined;
        if (res.length === 1) res = res[0];
        responses[i] = res;
        count += 1;
        if (count >= size) resolve(responses);
      }
      promises[i].then(onFufilled).catch(onFufilled);
    }
  });
}

/* Wrap async or promise functions and handle errors */
exports.errorWrap = function(callable) {
  return function() {
    return callable.apply(this,arguments).then(null).catch(function(...e) {
      console.error(`Encountered error running ${callable.name}`, ...e);
    })
  }
}

// Check the constructor of an item
exports.isOfBaseType = function(obj, constr) {
  return (![null, undefined].includes(obj)) && (obj.constructor === constr);
}

const MARKDOWN_CHARS = '*_|~>`';
exports.markdownEscape = function(text) {
  return Array.from(text).map(c => MARKDOWN_CHARS.includes(c) ? `\\${c}` : c).join('');
}

exports.extendPrototype = function(classVar, methods) {
  for (let key in methods) {
    /* defineProperty not required here, could use regular assignment */
    Object.defineProperty(classVar.prototype, key, {
      configurable: true,
      enumberable: true,
      writable: true,
      value: methods[key]
    });
  }
}
