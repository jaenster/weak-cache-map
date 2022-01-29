import {WeakCache} from '../src';

describe('it', function () {

    it('works', function () {
        const wkc = new WeakCache<number, { a(...[]) }>();


        let v;
        wkc.set(5, {
            a(a) {
                v = a;
            }
        });
        expect(wkc.has(5)).toBe(true);

        const obj = wkc.get(5);
        expect(obj).toHaveProperty('a');

        obj.a(17);
        expect(v).toBe(17);

        // Getting values works like an array
        {
            const [first] = Array.from(wkc.values());
            expect(first).toBe(obj);
        }

        {
            const [first] = Array.from(wkc.keys());
            expect(first).toBe(5);
        }

        {
            const [[key,value]] = Array.from(wkc);
            expect(key).toBe(5);
            expect(value).toBe(obj);
        }
    })

});