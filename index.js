'use strict';

(() => {
    const timeoutMS = 100;

    const _async = (fn, cb) => {
        setTimeout(() => cb(fn()), Math.random() * timeoutMS);
    };

    const AsyncArray = function (a = []) {
        if (!new.target) {
            return new AsyncArray(a);
        }

        this.read = (index, cb) =>
            _async(() => a[index], cb);

        this.size = (cb) => _async(() => a.length, cb)
    };

    Object.freeze(AsyncArray);
    globalThis.AsyncArray = AsyncArray;
})();

const input = AsyncArray([
    8,
    AsyncArray([
        15,
        16,
    ]),
    AsyncArray([
        AsyncArray([
            AsyncArray([
                42,
                AsyncArray([
                    AsyncArray([]),
                    23,
                ]),
            ]),
        ]),
        4,
    ]),
]);

solution(input).then(result => {
    const answer = [8, 15, 16, 42, 23, 4];
    const isEqual = String(answer) === String(result);

    if (isEqual) {
        console.log('OK');
    } else {
        console.log('WRONG');
    }
});

async function solution(input) {
    let result = [];
    let size = await new Promise((resolve) => input.size((size) => resolve(size))).then(size => size);
    function go(i) {
        if (i >= size) {
            return;
        }
        input.read(i, (elem) => getNestedArray(elem));
        go(i + 1);
    }
    go(0);
    let getNestedArray = async (asyncArray) => {
        if (asyncArray == '[object Object]') {
            let size = await new Promise((resolve) => asyncArray.size((size) => resolve(size))).then(size => size);
            for (let i = 0; i < size; i++) {
                asyncArray.read(i, (elem) => {
                    if (typeof(elem) == 'object') {
                        getNestedArray(elem);
                    }else{
                        console.log(elem);  
                        result.push(elem)
                    }
                });
            }
        }else{
            console.log(asyncArray);
            result.push(asyncArray)
        }
    }
    setTimeout(()=>{console.log(result)},2000)

    const test = () =>{
        setTimeout(()=>{return [8, 15, 16, 42, 23, 4]},2000)
    }
    new Promise((resolve) => resolve(test)).then(test => {
        const answer = [8, 15, 16, 42, 23, 4];
        const isEqual = String(answer) === String(test);
    
        if (isEqual) {
            console.log('OK');
        } else {
            console.log('WRONG');
        }
    });
}
