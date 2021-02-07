/**
 * Возвращает новый emitter
 * @returns {Object}
 */


function getEmitter() {
    function chain(x, y) {
        return () => {
            y()
            x()
        }
    }

    function lim(x, y, n) {
        return () => {
            let k = n;
            (() => {
                if (k != 0) {
                    y()
                    k--;
                }
            })()
            x()
        }
    }

    let res = {
        namespace: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            let index = event.indexOf('.')
            let name
            let rest
            if (index == -1) {
                index = event.length
                name = event.slice(0, index);
                rest = event.slice(index);
            } else {
                name = event.slice(0, index);
                rest = event.slice(index + 1);
            }
            if (!this.namespace.hasOwnProperty(name)) {
                this.namespace[name] = {
                    listeners: [],
                    namespace: {}
                }
            }
            if (rest !== '') {
                res.on.call(this.namespace[name], rest, context, handler);
            } else {
                this.namespace[name].listeners.push({ handler: () => handler.call(context), context: context })
            }
            // console.info(event, context, handler);
            return this
        },

        rem: function (context) {
            if (this !== undefined && this.listeners !== undefined) {
                this.listeners = this.listeners.filter(e => e.context !== context)
                for (name in this.namespace) {
                    res.rem.call(this.namespace[name], context)
                }
            }
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            let index = event.indexOf('.')
            let name
            let rest
            if (index == -1) {
                index = event.length
                name = event.slice(0, index);
                rest = event.slice(index);
            } else {
                name = event.slice(0, index);
                rest = event.slice(index + 1);
            }
            if (this.namespace.hasOwnProperty(name)) {
                if (rest !== '') {
                    res.off.call(this.namespace[name], rest, context);
                } else {
                    res.rem.call(this.namespace[name], context)
                }
            }
            return this
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            let index = event.indexOf('.')
            let name
            let rest
            if (index == -1) {
                index = event.length
                name = event.slice(0, index);
                rest = event.slice(index);
            } else {
                name = event.slice(0, index);
                rest = event.slice(index + 1);
            }
            if (this.namespace.hasOwnProperty(name)) {
                if (rest !== '') {
                    res.emit.call(this.namespace[name], rest);
                } else {
                    this.namespace[name].listeners.forEach(l => l.handler())
                }
            }
            if (this.hasOwnProperty("listeners")) {
                this.listeners.forEach(l => l.handler())
            }
            return this
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            // console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            // console.info(event, context, handler, frequency);
        }
    };

    return res
}


// let students = {
//     Sam: {
//         focus: 100,
//         wisdom: 50
//     },
//     Sally: {
//         focus: 100,
//         wisdom: 60
//     },
//     Bill: {
//         focus: 90,
//         wisdom: 50
//     },
//     Sharon: {
//         focus: 110,
//         wisdom: 40
//     }
// };

// let lecturer = getEmitter();

// // С началом лекции у всех резко повышаются показатели
// lecturer
//     .on('begin', students.Sam, function () {
//         this.focus += 10;
//     })
//     .on('begin', students.Sally, function () {
//         this.focus += 10;
//     })
//     .on('begin', students.Bill, function () {
//         this.focus += 10;
//         this.wisdom += 5;
//     })
//     .on('begin', students.Sharon, function () {
//         this.focus += 20;
//     });

// // На каждый слайд внимательность падает, но растет мудрость
// lecturer
//     .on('slide', students.Sam, function () {
//         this.wisdom += Math.round(this.focus * 0.1);
//         this.focus -= 10;
//     })
//     .on('slide', students.Sally, function () {
//         this.wisdom += Math.round(this.focus * 0.15);
//         this.focus -= 5;
//     })
//     .on('slide', students.Bill, function () {
//         this.wisdom += Math.round(this.focus * 0.05);
//         this.focus -= 10;
//     })
//     .on('slide', students.Sharon, function () {
//         this.wisdom += Math.round(this.focus * 0.01);
//         this.focus -= 5;
//     });

// // На каждый веселый слайд всё наоборот
// lecturer
//     .on('slide.funny', students.Sam, function () {
//         this.focus += 5;
//         this.wisdom -= 10;
//     })
//     .on('slide.funny', students.Sally, function () {
//         this.focus += 5;
//         this.wisdom -= 5;
//     })
//     .on('slide.funny', students.Bill, function () {
//         this.focus += 5;
//         this.wisdom -= 10;
//     })
//     .on('slide.funny', students.Sharon, function () {
//         this.focus += 10;
//         this.wisdom -= 10;
//     });


// console.log(students)

// // Начинаем лекцию
// lecturer.emit('begin');
// // Sam(110,50); Sally(110,60); Bill(100,55); Sharon(130,40)

// console.log(students)

// lecturer
//     .emit('slide.text')
//     .emit('slide.text')
//     .emit('slide.text')
//     .emit('slide.funny');
// // Sam(75,79); Sally(95,118); Bill(65,63); Sharon(120,34)

// console.log(students)

// lecturer
//     .off('slide.funny', students.Sharon)
//     .emit('slide.text')
//     .emit('slide.text')
//     .emit('slide.funny');
// // Sam(50,90); Sally(85,155); Bill(40,62); Sharon(105,37)

// console.log(students)

// lecturer
//     .off('slide', students.Bill)
//     .emit('slide.text')
//     .emit('slide.text')
//     .emit('slide.text');

// console.log(students)

// lecturer.emit('end');
// // Sam(20,102); Sally(70,191); Bill(40,62); Sharon(90,40)

// console.log(students)

module.exports = {
    getEmitter
};