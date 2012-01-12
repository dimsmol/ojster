
examples: examples-node examples-goog examples-goog-scope examples-universal

examples-node:
	ojster ./examples/node/templates

examples-goog:
	ojster ./examples/goog/templates --goog

examples-goog-scope:
	ojster ./examples/goog_scope/templates --goog --scope

examples-universal: examples-universal-goog-scope examples-universal-node

examples-universal-node:
	ojster ./examples/universal/templates ./examples/universal/compiled/node
	node ./examples/universal/node_example.js

examples-universal-goog-scope:
	ojster ./examples/universal/templates ./examples/universal/compiled/goog_scope --goog --scope


errors: errors-tokenization

errors-tokenization:
	ojster ./error_examples/tokenization.ojst 2>&1 | tee ./error_examples/results/tokenization_errors.txt
