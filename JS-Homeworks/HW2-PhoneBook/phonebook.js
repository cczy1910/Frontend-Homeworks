'use strict';

function subst(pat) {
    /**
     * @param {string} str
     * @param {number} pos
     */
    return (str, pos) => {
        for (let i = 0; i < pat.length; i++) {
            if (str[pos + i] !== pat[i]) {
                return [null, pos];
            }
        }
        return [str.slice(pos, pos + pat.length), pos + pat.length];
    }
}

function none(str, pos) {
    return [[], pos];
}

function or(parserA, parserB) {
    return (str, pos) => {
        let resA = parserA(str, pos);
        if (resA[0] !== null) {
            return resA;
        }
        let resB = parserB(str, pos);
        if (resB[0] !== null) {
            return resB;
        }
        return [null, Math.max(resA[1], resB[1])];
    }
}

function combine(parserA, parserB, combinator) {
    return (str, pos) => {
        let resA = parserA(str, pos);
        if (resA[0] !== null) {
            let resB = parserB(str, resA[1]);
            if (resB[0] !== null) {
                return [combinator(resA[0], resB[0]), resB[1]];
            }
            return [null, resB[1]];
        }
        return [null, resA[1]];
    }
}

function append(parserA, parserB) {
    return combine(parserA, parserB, (a, b) => a.concat([b]))
}

function any(...parsers) {
    return parsers.reduce(or);
}

function all(...parsers) {
    return parsers.reduce(append, none);
}

function repeat(parser, delim) {
    return (str, pos) => {
        let resD = delim(str, pos);
        if (resD[0] !== null) {
            let resP = parser(str, resD[1]);
            if (resP[0] !== null) {
                let resTail = repeat(parser, delim)(str, resP[1]);
                if (resTail[0] !== null) {
                    resTail[0].unshift(resP[0])
                }
                return resTail;
            } else {
                return resP;
            }
        } else {
            return [[], pos]
        }
    }
}

function list(parser, delim) {
    return combine(parser, repeat(parser, delim), (a, b) => [a].concat(b))
}

function not(char) {
    return (str, pos) => {
        let i = pos;
        for (; i < str.length && str[i] !== char; i++);
        // console.log(str.slice(pos, i));
        return [str.slice(pos, i), i];
    }
}

function num(str, pos) {
    let i = pos;
    for (; i < str.length && str[i] >= '0' && str[i] <= '9'; i++);
    if (i - pos != 10) {
        return [null, pos];
    }
    return [str.slice(pos, i), i];
}

let adr = not(" ");

let name = not(";");

let pch = all(subst("почту "), adr, subst(" "));

let tel = all(subst("телефон "), num, subst(" "));

let del = subst("и ");

let addAcc =
    all(
        subst("Создай "),
        subst("контакт "),
        name
    )

let remAcc =
    all(
        subst("Удали "),
        subst("контакт "),
        name
    )

let addDat =
    all(
        subst("Добавь "),
        list(
            any(pch, tel),
            subst("и ")),
        subst("для "),
        subst("контакта "),
        name);


let remDat =
    all(
        subst("Удали "),
        list(
            any(pch, tel),
            subst("и ")),
        subst("для "),
        subst("контакта "),
        name);

let showQue =
    all(
        subst("Покажи "),
        list(
            any(
                subst("почты "),
                subst("телефоны "),
                subst("имя ")
            ),
            subst("и ")
        ),
        subst("для "),
        subst("контактов, "),
        subst("где "),
        subst("есть "),
        name
    )

let remQue =
    all(
        subst("Удали "),
        subst("контакты, "),
        subst("где "),
        subst("есть "),
        name
    )

let command = any(
    addAcc,
    remAcc,
    addDat,
    remDat,
    showQue,
    remQue
)

function parse(str) {
    return command(str, 0);
}

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

function procAddAcc(name) {
    if (!phoneBook.has(name)) {
        phoneBook.set(name,
            {
                name: name,
                addrs: new Set(),
                nums: new Set()
            })
    }
}

function procRemAcc(name) {
    if (phoneBook.has(name)) {
        phoneBook.delete(name);
    }
}

function procAddDat(data, name) {
    let acc = phoneBook.get(name);
    if (acc) {
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] === "почту ") {
                acc.addrs.add(data[i][1]);
            } else {
                acc.nums.add(data[i][1]);
            }
        }
    }
}

function procRemDat(data, name) {
    let acc = phoneBook.get(name);
    if (acc) {
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] === "почту ") {
                acc.addrs.delete(data[i][1]);
            } else {
                acc.nums.delete(data[i][1]);
            }
        }
    }
}

function accContain(acc, query) {
    if (acc.name.includes(query)) {
        return true;
    }
    for (const addr of acc.addrs) {
        if (addr.includes(query)) {
            return true;
        }
    }
    for (const num of acc.nums) {
        if (num.includes(query)) {
            return true;
        }
    }
    return false;
}

function procShowQue(kinds, query) {
    // console.log(kinds);
    // console.log(query);
    let res = [];
    if (query === "") {
        return res;
    }
    for (const acc of phoneBook.values()) {
        if (accContain(acc, query)) {
            let curRes = [];
            for (let i = 0; i < kinds.length; i++) {
                if (kinds[i] === "имя ") {
                    curRes.push(acc.name);
                } else if (kinds[i] === "почты ") {
                    curRes.push(Array.from(acc.addrs).join());
                } else {
                    curRes.push(Array.from(acc.nums).map(s => "+7 (" + s.slice(0, 3) + ") " + s.slice(3, 6) + "-" + s.slice(6, 8) + "-" + s.slice(8, 10)).join());
                }
            }
            res.push(curRes.join(";"))
        }
    }
    // console.log(res);
    return res;
}

function procRemQue(query) {
    if (query === "") {
        return;
    }
    for (const acc of phoneBook.values()) {
        if (accContain(acc, query)) {
            phoneBook.delete(acc.name)
        }
    }
}

function proceed(cmd) {
    // console.log(cmd)
    if (cmd[0] === "Удали ") {
        if (cmd[1] === "контакт ") {
            procRemAcc(cmd[2]);
        } else if (cmd[1] === "контакты, ") {
            procRemQue(cmd[4]);
        } else {
            procRemDat(cmd[1], cmd[4]);
        }
    } else if (cmd[0] === "Создай ") {
        procAddAcc(cmd[2]);
    } else if (cmd[0] === "Добавь ") {
        procAddDat(cmd[1], cmd[4]);
    } else {
        return procShowQue(cmd[1], cmd[6]);
    }
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    if (query === '') {
        return [];
    }
    let lines = query.split(';');
    if (lines[lines.length - 1] !== '') {
        syntaxError(lines.length, lines[lines.length - 1].length + 1);
    }
    let cmds = lines.slice(0, lines.length - 1).map(parse);
    let response = [];
    // console.log(cmds);
    for (let i = 0; i < cmds.length; i++) {
        if (cmds[i][0]) {
            let res = proceed(cmds[i][0]);
            // console.log(res);
            if (res) {
                response = response.concat(res);
            }
        } else {
            syntaxError(i + 1, cmds[i][1] + 1);
        }
    }
    // console.log(response);
    return response;
}

// console.log(subst("a")()

module.exports = { phoneBook, run };

// const fs = require("fs")

// run(fs.readFileSync("input"))

// exec(addAcc, "Создай контакт Григорий;")
// exec(addAcc, "")