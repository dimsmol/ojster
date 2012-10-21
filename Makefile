
check: examples errors

examples: examples-node examples-client examples-goog examples-goog-scope examples-universal

examples-node:
	ojster ./examples/node/templates

examples-client: examples-amd examples-browserglobals examples-client-universal

examples-amd:
	ojster ./examples/client/templates ./examples/client/compiled/amd --amd

examples-browserglobals:
	ojster ./examples/client/templates ./examples/client/compiled/browserglobals --browserglobals

examples-client-universal:
	ojster ./examples/client/templates ./examples/client/compiled/universal --client

examples-goog:
	ojster ./examples/goog/templates --goog

examples-goog-scope:
	ojster ./examples/goog_scope/templates --goog --scope

examples-universal: examples-universal-goog-scope examples-universal-node examples-universal-client

examples-universal-node:
	ojster ./examples/universal/templates ./examples/universal/compiled/node
	node ./examples/universal/node_example.js

examples-universal-client: examples-universal-amd examples-universal-browserglobals examples-universal-client-universal

examples-universal-amd:
	ojster ./examples/universal/templates ./examples/universal/compiled/client/amd --amd

examples-universal-browserglobals:
	ojster ./examples/universal/templates ./examples/universal/compiled/client/browserglobals --browserglobals

examples-universal-client-universal:
	ojster ./examples/universal/templates ./examples/universal/compiled/client/universal --client

examples-universal-goog-scope:
	ojster ./examples/universal/templates ./examples/universal/compiled/goog_scope --goog --scope


errors: errors-tokenization errors-generation

errors-tokenization:
	ojster ./error_examples/tokenization.ojst 2> ./error_examples/results/tokenization_errors.txt || true

errors-generation:
	ojster ./error_examples/generation 2> ./error_examples/results/generation_errors.txt || true
