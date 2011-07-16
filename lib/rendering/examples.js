
module.exports.render = function(template, data, args) {
	var writer = new StringWriter();
	var instance = new template(writer, data);
	instance.writeBlockMain.apply(instance, args);
	return writer.getValue();
};

Template.getBased = function(MyTemplate, MyBaseTemplate){
	var proto = MyTemplate.prototype;
	var result = {};
	stub = function() {};
	stub.prototype = MyBaseTemplate.prototype;
	result.prototype = new stub();
	for (p in MyTemplate.prototype) {
		if (MyTemplate.prototype.hasOwnProperty(p)) {
			result.prototype[p] = MyTemplate.prototype[p];
		}
	}
}

new MyTemplate(ctx, data).getRendered(args) = new MyTemplate(ctx, data).render(args).done()

//// from outside

// render template
MyTemplate.render(data, ctx, args)
ojster.render(MyTemplate, data, ctx, args)
ojster.renderElement(MyTemplate, data, ctx, args, domHelper)
ojster.renderAsFragment(MyTemplate, data, ctx, args, domHelper)
ojster.renderAsElement(MyTemplate, data, ctx, args, domHelper)

new MyTemplate(ctx, data).render(args)
ojster.createElement(new MyTemplate(ctx, data).render(args), domHelper)
ojster.asElement(new MyTemplate(ctx, data).render(args), domHelper)
ojster.asFragment(new MyTemplate(ctx, data).render(args), domHelper)

// render template to writer
MyTemplate.render(data, ctx, args, writer)
ojster.render(MyTemplate, data, ctx, args, writer)
ojster.renderTo(writer, MyTemplate, data, ctx, args)

new MyTemplate(ctx, data, writer).render(args)

// render template block(s)
MyTemplate.renderBlockZetta(ctx, data, args, writer) // не годится, нельзя вызвать определенный в базовом классе блок
ojster.template(MyTemplate, ctx, data, writer).renderAlfaBlock(args).renderGammaBlock(args).done()
new MyTemplate(ctx, data, writer).renderAlfaBlock(args).renderGammaBlock(args).done()


//// from within

// render template block
self.renderBlockZetta(1, 2, 3);
// render other template ?
new OtherTemplate(ctx, data, self).render(args)
// render other template block ?
self.renderTemplate(OtherTemplate.blocks.Alfa, data, [1, 2, 3]);
new OtherTemplate(ctx, data, self).renderBlockGamma(args).renderBlockDelta(args)
self.template(OtherTemplate, ctx, data).renderBlockGamma(args).renderBlockDelta(args)

MyTemplate.render(data)
MyTemplate.render(data, self)

ojster.render(MyTemplate.blockZetta, {some: data}, [a, b, c])
ojster.renderTo(self.writer, OtherTemplate, {another: data});

ojster.renderer(MyTemplate, {some: data}, writer).renderBlockMain(args).result();

(new MyTemplate(writer, {some:data})).renderBlockZetta().result()
