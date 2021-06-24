import parser from './opts-parser.js';

describe('opts-parser', () => {
	let opts = null;

	describe('.defaults', () => {
		beforeAll(() => {
			opts = { foo: 'bar' };
			parser.defaults(opts, { foo: 'default', 'fiz-biz': 1 });
		});

		it('has foo', () => expect(opts.foo).not.toBeUndefined('foo'));
		it('is bar', () => expect(opts.foo).toEqual('bar'));
		it('has fizBiz', () => expect(opts.fizBiz).not.toBeUndefined());
		it('has fiz-biz', () => expect(opts['fiz-biz']).not.toBeUndefined());
		it('is 1', () => expect(opts.fizBiz).toEqual(1));
	});

	describe('.parse', () => {
		describe('booleans', () => {
			beforeAll(() => { opts = parser.parse('foo: true; bar: false;'); });
			it('has true foo', () => expect(opts.foo).toBe(true));
			it('has false bar', () => expect(opts.bar).toBe(false));
		});

		describe('words', () => {
			beforeAll(() => { opts = parser.parse('foo: bar'); });
			it('words - has foo', () => expect(opts.foo).not.toBeUndefined());
			it('words - is bar', () => expect(opts.foo).toEqual('bar'));
		});

		describe('arrays', () => {
			beforeAll(() => { opts = parser.parse('foo: [hello, world]'); });
			it('arrays - has foo', () => expect(opts.foo).not.toBeUndefined());
			it('arrays - is array', () => expect(opts.foo).toEqual(['hello', 'world']));
		});

		describe('strings', () => {
			describe('single quoted', () => {
				beforeAll(() => { opts = parser.parse('foo: \'hello, world\' '); });
				it('strings - has foo', () => expect(opts.foo).not.toBeUndefined());
				it('strings - is hello, world', () => expect(opts.foo).toEqual('hello, world'));
			});

			describe('double quoted', () => {
				beforeAll(() => { opts = parser.parse('foo: "hello, world" '); });
				it('double quoted - has foo', () => expect(opts.foo).not.toBeUndefined());
				it('double quoted - is hello, world', () => expect(opts.foo).toEqual('hello, world'));
			});
		});

		describe('all', () => {
			beforeAll(() => { opts = parser.parse('foo-baz: \'hello, world\'; helloWorld: [1,2,3]; color: #000'); });
			it('has key fooBaz', () => expect(opts.fooBaz).not.toBeUndefined());
			it('has key foo-baz', () => expect(opts['foo-baz']).not.toBeUndefined());
			it('has key helloWorld', () => expect(opts.helloWorld).not.toBeUndefined());
			it('has key color', () => expect(opts.color).not.toBeUndefined());
			it('has color', () => expect(opts.color).toEqual('#000'));
		});
	});
});
