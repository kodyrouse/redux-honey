

export default () => {
  function st2(f) {
    var args = [];
    if (f) {
        for (var i = 0; i < f.arguments.length; i++) {
            args.push(f.arguments[i]);
        }
        var function_name = f.toString().split('(')[0].substring(9);
        return st2(f.caller) + function_name + '(' + args.join(', ') + ')' + "\n";
    } else {
        return "";
    }
  }
  return st2(arguments.callee.caller);
}