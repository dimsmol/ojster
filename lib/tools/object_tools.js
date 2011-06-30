
module.exports.extend = function(target, obj) {
    // TODO more correct implementation
    if (obj) {
        for(var k in obj) {
            target[k] = obj[k];
        }
    }

    return target;
};
