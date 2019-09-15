module.exports = {
	'env': {
		'node': true,
		'es6': true
	},
	// Configuration for TypeScript
	'parser': '@typescript-eslint/parser',
	'plugins': ['@typescript-eslint'],
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended'
	],
	// Support new ECMA features and specifications
	'parserOptions': {
		'ecmaVersion': 2017,
		'sourceType': 'module'
	},
	'rules': {
		// Consistent braces
		'brace-style': ['error', 'stroustrup'],
		// Disallow use of global declarations using var
		'no-var': 2,
		// Require variables are declared separately
		'one-var': ['error', 'never'],
		// Enforce variables that aren't reassigned be declared using const instead of let
		'prefer-const': 2,
		// Warn on console.log usage
		'no-console': 1,
		// Enforce usage of single quotes
		'quotes': 0,
		'@typescript-eslint/quotes': ['error', 'single'],
		// Enforce semicolons are the end of each line
		'semi': 0,
		'@typescript-eslint/semi': 2
	}
};