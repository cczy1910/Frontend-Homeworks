'use strict';

function tokenize(time) {
    let template = /([А-Я]{2}) (\d\d):(\d\d)\+(\d+)/;
    let res = template.exec(time);
    res.shift();
    return res;
}

function parse(tokens, zone) {
    let res = 0;
    let weekday = 0;
    switch (tokens[0]) {
        case ('ВС'):
            weekday += 1;
        case ('СБ'):
            weekday += 1;
        case ('ПТ'):
            weekday += 1;
        case ('ЧТ'):
            weekday += 1;
        case ('СР'):
            weekday += 1;
        case ('ВТ'):
            weekday += 1;
    }
    res += weekday * 24 * 60;
    res += (parseInt(tokens[1]) + zone - parseInt(tokens[3])) * 60;
    res += parseInt(tokens[2])
    return res;
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
    let fromTokens = /(\d\d):(\d\d)\+(\d)+/.exec(workingHours.from);
    let toTokens = /(\d\d):(\d\d)\+(\d)+/.exec(workingHours.to);
    let timesone = parseInt(fromTokens[3]);

    let from = parse(fromTokens, timesone);
    let to = parse(toTokens, timesone);

    let openBeg = [
        from, 1440 + from, 2880 + from
    ]

    let openEnd = [
        to, 1440 + to, 2880 + to
    ]

    // console.log(timesone);
    let pos = 0;
    let aBuisyBeg = [];
    let bBuisyBeg = [];
    let cBuisyBeg = [];

    let aBuisyEnd = [];
    let bBuisyEnd = [];
    let cBuisyEnd = [];

    let aSched = schedule.Danny;
    for (let i = 0; i < aSched.length; i++) {
        aBuisyBeg.push(parse(tokenize(aSched[i].from), timesone));
        aBuisyEnd.push(parse(tokenize(aSched[i].to), timesone));
    }

    let bSched = schedule.Rusty;
    for (let i = 0; i < bSched.length; i++) {
        bBuisyBeg.push(parse(tokenize(bSched[i].from), timesone));
        bBuisyEnd.push(parse(tokenize(bSched[i].to), timesone));
    }

    let cSched = schedule.Linus;
    for (let i = 0; i < cSched.length; i++) {
        cBuisyBeg.push(parse(tokenize(cSched[i].from), timesone));
        cBuisyEnd.push(parse(tokenize(cSched[i].to), timesone));
    }

    aBuisyBeg.sort((a, b) => a - b);
    bBuisyBeg.sort((a, b) => a - b);
    cBuisyBeg.sort((a, b) => a - b);
    aBuisyEnd.sort((a, b) => a - b);
    bBuisyEnd.sort((a, b) => a - b);
    cBuisyEnd.sort((a, b) => a - b);

    let start = 0;
    let time = -1;
    let span = 0;

    let aBuisy = false;
    let bBuisy = false;
    let cBuisy = false;
    let open = false;
    let nextPoint = -1;

    while (start < 4320) {
        if (aBuisy) {
            if (aBuisyEnd[0] === start) {
                aBuisy = false;
                aBuisyEnd.shift();
            }
        } else {
            if (aBuisyBeg[0] === start) {
                aBuisy = true;
                aBuisyBeg.shift();
            }
        }
        if (bBuisy) {
            if (bBuisyEnd[0] === start) {
                bBuisy = false;
                bBuisyEnd.shift();
            }
        } else {
            if (bBuisyBeg[0] === start) {
                bBuisy = true;
                bBuisyBeg.shift();
            }
        }
        if (cBuisy) {
            if (cBuisyEnd[0] === start) {
                cBuisy = false;
                cBuisyEnd.shift();
            }
        } else {
            if (cBuisyBeg[0] === start) {
                cBuisy = true;
                cBuisyBeg.shift();
            }
        }
        if (open) {
            if (openEnd[0] === start) {
                open = false;
                openEnd.shift();
            }
        } else {
            if (openBeg[0] === start) {
                open = true;
                openBeg.shift();
            }
        }

        if (!(aBuisy || bBuisy || cBuisy) && open) {
            span++;
            if (span === duration) {
                time = start - duration + 1;
                nextPoint = time + 30;
                break;
            }
        } else {
            span = 0;
        }
        start++;
    }

    return {
        /**
         * Найдено ли время
         * @returns {boolean}
         */
        exists() {
            return time !== -1;
        },

        /**
         * Возвращает отформатированную строку с часами
         * для ограбления во временной зоне банка
         *
         * @param {string} template
         * @returns {string}
         *
         * @example
         * ```js
         * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
         * ```
         */
        format(template) {
            if (time === -1) {
                return '';
            }
            let minutes = time % 60;
            let hours = ((time - minutes) / 60) % 24;
            let days = ((time - minutes - hours * 60) / 1440);
            let day = 'ПН';
            switch (days) {
                case 1:
                    day = 'ВТ';
                    break;
                case 2:
                    day = 'СР';
                    break;
            }
            let res = template.replace(/%DD/, day);
            if (hours < 10) {
                res = res.replace(/%HH/, '0' + hours);
            } else {
                res = res.replace(/%HH/, hours);
            }
            if (minutes < 10) {
                res = res.replace(/%MM/, '0' + minutes);
            } else {
                res = res.replace(/%MM/, minutes);
            }
            return res;
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
         * @returns {boolean}
         */
        tryLater() {
            span = 0;
            if (start < nextPoint) {
                while (start < nextPoint && start < 4320) {
                    if (aBuisy) {
                        if (aBuisyEnd[0] === start) {
                            aBuisy = false;
                            aBuisyEnd.shift();
                        }
                    } else {
                        if (aBuisyBeg[0] === start) {
                            aBuisy = true;
                            aBuisyBeg.shift();
                        }
                    }
                    if (bBuisy) {
                        if (bBuisyEnd[0] === start) {
                            bBuisy = false;
                            bBuisyEnd.shift();
                        }
                    } else {
                        if (bBuisyBeg[0] === start) {
                            bBuisy = true;
                            bBuisyBeg.shift();
                        }
                    }
                    if (cBuisy) {
                        if (cBuisyEnd[0] === start) {
                            cBuisy = false;
                            cBuisyEnd.shift();
                        }
                    } else {
                        if (cBuisyBeg[0] === start) {
                            cBuisy = true;
                            cBuisyBeg.shift();
                        }
                    }
                    if (open) {
                        if (openEnd[0] === start) {
                            open = false;
                            openEnd.shift();
                        }
                    } else {
                        if (openBeg[0] === start) {
                            open = true;
                            openBeg.shift();
                        }
                    }

                    // if (!(aBuisy || bBuisy || cBuisy) && open) {
                    //     span++;
                    //     if (span === duration) {
                    //         time = start - duration + 1;
                    //         nextPoint = time + 30;
                    //         break;
                    //     }
                    // } else {
                    //     span = 0;
                    // }
                    start++;
                }
            } else {
                start = nextPoint;
            }
            let newTime = -1;
            while (start < 4320) {
                if (aBuisy) {
                    if (aBuisyEnd[0] === start) {
                        aBuisy = false;
                        aBuisyEnd.shift();
                    }
                } else {
                    if (aBuisyBeg[0] === start) {
                        aBuisy = true;
                        aBuisyBeg.shift();
                    }
                }
                if (bBuisy) {
                    if (bBuisyEnd[0] === start) {
                        bBuisy = false;
                        bBuisyEnd.shift();
                    }
                } else {
                    if (bBuisyBeg[0] === start) {
                        bBuisy = true;
                        bBuisyBeg.shift();
                    }
                }
                if (cBuisy) {
                    if (cBuisyEnd[0] === start) {
                        cBuisy = false;
                        cBuisyEnd.shift();
                    }
                } else {
                    if (cBuisyBeg[0] === start) {
                        cBuisy = true;
                        cBuisyBeg.shift();
                    }
                }
                if (open) {
                    if (openEnd[0] === start) {
                        open = false;
                        openEnd.shift();
                    }
                } else {
                    if (openBeg[0] === start) {
                        open = true;
                        openBeg.shift();
                    }
                }
        
                if (!(aBuisy || bBuisy || cBuisy) && open) {
                    span++;
                    if (span === duration) {
                        newTime = start - duration + 1;
                        nextPoint = newTime + 30;
                        break;
                    }
                } else {
                    span = 0;
                }
                start++;
            }
            if (newTime !== -1) {
                time = newTime;
                return true;
            }
            else return false;
        }
    };
}

let isExtraTaskSolved = true;

module.exports = {
    getAppropriateMoment, isExtraTaskSolved
};

// let gangSchedule = {
//     "Danny": [
//         { "from": "ПН 12:00+5", "to": "ПН 17:00+5" },
//         { "from": "ВТ 13:00+5", "to": "ВТ 16:00+5" }
//     ],
//     "Rusty": [
//         { "from": "ПН 11:30+5", "to": "ПН 16:30+5" },
//         { "from": "ВТ 13:00+5", "to": "ВТ 16:00+5" }
//     ],
//     "Linus": [
//         { "from": "ПН 09:00+3", "to": "ПН 14:00+3" },
//         { "from": "ПН 21:00+3", "to": "ВТ 09:30+3" },
//         { "from": "СР 09:30+3", "to": "СР 15:00+3" }
//     ]
// };

// let bankWorkingHours = { "from": "10:00+5", "to": "18:00+5" };

// // Время не существует
// const longMoment = getAppropriateMoment(gangSchedule, 121, bankWorkingHours);

// // Выведется `false` и `""`
// console.info(longMoment.exists());
// console.info(longMoment.format('Метим на %DD, старт в %HH:%MM!'));

// // Время существует
// const moment = getAppropriateMoment(gangSchedule, 90, bankWorkingHours);

// // Выведется `true` и `"Метим на ВТ, старт в 11:30!"`
// console.info(moment.exists());
// console.info(moment.format('Метим на %DD, старт в %HH:%MM!'));

// // Дополнительное задание
// // Вернет `true`
// moment.tryLater();
// // `"ВТ 16:00"`
// console.info(moment.format('%DD %HH:%MM'));

// // Вернет `true`
// moment.tryLater();
// // `"ВТ 16:30"`
// console.info(moment.format('%DD %HH:%MM'));

// // Вернет `true`
// moment.tryLater();
// // `"СР 10:00"`
// console.info(moment.format('%DD %HH:%MM'));

// // Вернет `false`
// moment.tryLater();
// // `"СР 10:00"`
// console.info(moment.format('%DD %HH:%MM'));