
var template = function(templateClass, ctx, data, writer) {
	var instance = new templateClass(ctx, data, writer);
	return instance;
};

var render = function(templateClass, ctx, data, args, writer) {
	var instance = template(templateClass, ctx, data, writer);
	return instance.render.apply(instance, args);
};

var getRendered = function(templateClass, ctx, data, args, writer) {
	return render(templateClass, ctx, data, args, writer).done();
};
