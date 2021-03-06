'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if ((typeof(a) !== 'number') || (typeof(b) !== 'number')) {
        throw new TypeError();
    }
    return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    if (typeof(year) !== 'number') {
        throw new TypeError();
    }
    if (year < 0) {
        throw new RangeError();
    }
    return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    if (typeof(hexColor) !== 'string') {
        throw new TypeError();
    }
    if (!(/^#[\da-fA-F][\da-fA-F][\da-fA-F][\da-fA-F][\da-fA-F][\da-fA-F]$/.test(hexColor))) {
        throw new RangeError();
    }
    return '(' + parseInt(hexColor.substring(1, 3), 16) + ', ' + parseInt(hexColor.substring(3, 5), 16) + ', ' + parseInt(hexColor.substring(5, 7), 16) + ')';
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    if (typeof(n) !== 'number') {
        throw new TypeError();
    }
    if (n <= 0) {
        throw new RangeError();
    }
    let cur = 1;
    let nxt = 1;
    for (let i = 1; i < n; i++) {
        let t = nxt;
        nxt += cur;
        cur = t;
    }
    return cur;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    if (!(matrix instanceof Array)) {
        throw new TypeError();
    }
    matrix.forEach(row => {
        if (!(row instanceof Array)) {
            throw new TypeError();
        }
    })
    let res = [];
    for (let i = 0; i < matrix[0].length; i++) {
        let tmp = []
        for (let j = 0; j < matrix.length; j++) {
            tmp.push(matrix[j][i]);
        }
        res.push(tmp);
    }
    return res;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    if ((typeof(n) !== 'number') || (typeof(targetNs) !== 'number')) {
        throw new TypeError();
    }
    if ((targetNs < 2) || (targetNs > 36)) {
        throw new RangeError();
    }
    return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    if (typeof(phoneNumber) !== 'string') {
        throw new TypeError();
    }
    return /^8-800-\d\d\d-\d\d-\d\d$/.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    if (typeof(text) !== 'string') {
        throw new TypeError();
    }
    return Array.from(text.matchAll(/(:-\)|\(-:)/g)).length;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    if (
        (field[0][0] === 'x' && field[0][1] === 'x' && field[0][2] === 'x') ||
        (field[1][0] === 'x' && field[1][1] === 'x' && field[1][2] === 'x') ||
        (field[2][0] === 'x' && field[2][1] === 'x' && field[2][2] === 'x') ||
        (field[0][0] === 'x' && field[1][0] === 'x' && field[2][0] === 'x') ||
        (field[0][1] === 'x' && field[1][1] === 'x' && field[2][1] === 'x') ||
        (field[0][2] === 'x' && field[1][2] === 'x' && field[2][2] === 'x') ||
        (field[0][0] === 'x' && field[1][1] === 'x' && field[2][2] === 'x') ||
        (field[0][2] === 'x' && field[1][1] === 'x' && field[2][0] === 'x')
    ) {
        return 'x';
    } else if (
        (field[0][0] === 'o' && field[0][1] === 'o' && field[0][2] === 'o') ||
        (field[1][0] === 'o' && field[1][1] === 'o' && field[1][2] === 'o') ||
        (field[2][0] === 'o' && field[2][1] === 'o' && field[2][2] === 'o') ||
        (field[0][0] === 'o' && field[1][0] === 'o' && field[2][0] === 'o') ||
        (field[0][1] === 'o' && field[1][1] === 'o' && field[2][1] === 'o') ||
        (field[0][2] === 'o' && field[1][2] === 'o' && field[2][2] === 'o') ||
        (field[0][0] === 'o' && field[1][1] === 'o' && field[2][2] === 'o') ||
        (field[0][2] === 'o' && field[1][1] === 'o' && field[2][0] === 'o')
    ) {
        return 'o';
    } else {
        return 'draw';
    }
}

module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};

ticTacToeProblem([
    ['x', 'x', 'o'],
    ['o', 'o', 'x'],
    ['o', 'x', 'o']
])