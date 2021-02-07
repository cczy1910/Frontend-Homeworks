'use strict';

function findFriend(friends, name) {
    let len = friends.length;

    while (len--) {
        if (friends[len].name === name) {
            return friends[len];
        }
    }
}

function parseCircles(friends, filter) {
    let circles = [];
    let visited = new Set();
    let firstCircle = [];
    friends.forEach(friend => {
        if (friend.hasOwnProperty('best') && friend['best'] === true) {
            visited.add(friend['name']);
            firstCircle.push(friend);
        }
    });
    if (firstCircle.length !== 0) {
        circles.push(firstCircle);
        for (let i = 1; true; i++) {
            let nextCircle = [];
            circles[i - 1].forEach(friend => {
                friend['friends'].forEach(name => {
                    if (!visited.has(name)) {
                        visited.add(name);
                        nextCircle.push(name);
                    }
                });
            });
            if (nextCircle.length === 0) {
                break;
            }
            circles.push(nextCircle.map(x => findFriend(friends, x)));
        }
    }
    return filter.sift(circles).map(x => x.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }));
}


/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.friends = parseCircles(friends, filter);
    this.circle = 0;
    this.index = 0;
    this.skip();
}

Iterator.prototype.skip = function () {
    while (this.circle < this.friends.length && this.index >= this.friends[this.circle].length) {
        this.circle++;
        this.index = 0;
    }
}

Iterator.prototype.done = function () {
    return this.circle === this.friends.length;
}

Iterator.prototype.next = function () {
    if (this.done()) {
        return null;
    } else {
        let res = this.friends[this.circle][this.index];
        this.index++;
        this.skip();
        return res;
    }
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.call(this, friends, filter)
    this.friends = this.friends.slice(0, Math.max(0, maxLevel));
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.check = function () { return true }
}

Filter.prototype.sift = function (friends) {
    return friends.map((circle) => circle.filter((friend) => this.check(friend)))
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.check = function (friend) {
        return friend.hasOwnProperty('gender') && friend['gender'] === 'male';
    }
}

MaleFilter.prototype = Object.create(Filter.prototype)
MaleFilter.prototype.constructor = MaleFilter

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.check = function (friend) {
        return friend.hasOwnProperty('gender') && friend['gender'] === 'female';
    }
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;





// const friends = [
//     {
//         name: 'Sam',
//         friends: ['Mat', 'Sharon'],
//         gender: 'male',
//         best: true
//     },
//     {
//         name: 'Sally',
//         friends: ['Brad', 'Emily'],
//         gender: 'female',
//         best: true
//     },
//     {
//         name: 'Mat',
//         friends: ['Sam', 'Sharon'],
//         gender: 'male'
//     },
//     {
//         name: 'Sharon',
//         friends: ['Sam', 'Itan', 'Mat'],
//         gender: 'female'
//     },
//     {
//         name: 'Brad',
//         friends: ['Sally', 'Emily', 'Julia'],
//         gender: 'male'
//     },
//     {
//         name: 'Emily',
//         friends: ['Sally', 'Brad'],
//         gender: 'female'
//     },
//     {
//         name: 'Itan',
//         friends: ['Sharon', 'Julia', 'Pupa'],
//         gender: 'male'
//     },
//     {
//         name: 'Julia',
//         friends: ['Brad', 'Itan'],
//         gender: 'female'
//     },
//     {
//         name: 'Pupa',
//         friends: ['Itan', 'Lupa'],
//         gender: 'male',
//     },
//     {
//         name: 'Lupa',
//         friends: ['Pupa', 'Tanya'],
//         gender: 'male',
//     },
//     {
//         name: 'Tanya',
//         friends: ['Lupa'],
//         gender: 'female',
//     }
// ];

// function friend(name) {
//     let len = friends.length;

//     while (len--) {
//         if (friends[len].name === name) {
//             return friends[len];
//         }
//     }
// }

// const maleFilter = new MaleFilter();
// const femaleFilter = new FemaleFilter();
// const maleIterator = new LimitedIterator(friends, maleFilter, 2);
// const femaleIterator = new Iterator(friends, femaleFilter);

// const invitedFriends = [];

// while (!maleIterator.done() && !femaleIterator.done()) {
//     invitedFriends.push([
//         maleIterator.next(),
//         femaleIterator.next()
//     ]);
// }

// while (!femaleIterator.done()) {
//     invitedFriends.push(femaleIterator.next());
// }

// console.log(invitedFriends)




exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;