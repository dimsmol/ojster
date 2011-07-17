
examples: examples-node examples-goog examples-goog-scope examples-universal

examples-node:
	@ojster ./examples/node/templates

examples-goog:
	@ojster ./examples/goog/templates --goog

examples-goog-scope:
	@ojster ./examples/goog_scope/templates --goog --scope

examples-universal: examples-universal-node examples-universal-goog-scope

examples-universal-node:
	@ojster ./examples/universal/templates ./examples/universal/compiled/node

examples-universal-goog-scope:
	@ojster ./examples/universal/templates ./examples/universal/compiled/goog_scope --goog --scope
