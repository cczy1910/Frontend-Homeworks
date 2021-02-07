let mockData = [{
    city: "Moscow",
    iata_code: "SVO"
},
{
    city: "Moscow",
    iata_code: "DME"
},
{
    city: "Moscow",
    iata_code: "VKO"
},
{
    city: "Saint-Perersburg",
    iata_code: "LED"
},
{
    city: "Vladikavkaz",
    iata_code: "OGZ"
}
]

function debounce(func, wait) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        let later = function () {
            func.apply(context, args);
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

function defocusAll() {
    let suggestBox = document.querySelector(".suggest__suggest-box")
    Array.from(suggestBox.children).forEach(defocus)
}

function formatSuggestion(suggestion) {
    let line = document.createElement("div")
    line.setAttribute("class", "suggest__suggest-line")
    line.setAttribute("data-text", suggestion.city + ", " + suggestion.iata_code)
    line.innerHTML =
        `<span class="suggest__city-name">` + suggestion.city + `</span>
        <span class="suggest__aero-code">` + suggestion.iata_code + `</span>`
    line.addEventListener("mouseenter", e => focus(e.target))
    line.addEventListener("mouseleave", defocusAll)
    line.addEventListener("click", () => substitute(line))
    return line
}

function showSuggest(suggest) {
    let suggestBox = document.querySelector(".suggest__suggest-box")
    suggestBox.innerHTML = ""
    if (suggest.length == 0) {
        suggestBox.setAttribute("class", "suggest__suggest-box suggest__suggest-box_empty")
    } else {
        suggestBox.setAttribute("class", "suggest__suggest-box")
        suggest.map(formatSuggestion).forEach(element => {
            suggestBox.appendChild(element)
        });
    }
}

function makeRequest(request, callback) {
    fetch("https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json")
        .then(response => response.json())
        .catch(() => mockData)
        .then(data => data.filter(x => request.length !== 0 && (x.iata_code.toLowerCase().startsWith(request) || x.city.toLowerCase().startsWith(request))))
        .then(res => callback(res))
}

let onKeySuggest = debounce(function (e) {
    let text = e.target.value.toLowerCase()
    makeRequest(text, function (response) {
        showSuggest(response)
    })
}, 300)

function focus(line) {
    defocusAll()
    line.setAttribute("class", "suggest__suggest-line suggest__suggest-line_focused")
}

function defocus(line) {
    line.setAttribute("class", "suggest__suggest-line")
}

function focusFirst() {
    let suggestBox = document.querySelector(".suggest__suggest-box")
    if (suggestBox.firstElementChild !== null) {
        focus(suggestBox.firstElementChild);
    }
}

function focusLast() {
    let suggestBox = document.querySelector(".suggest__suggest-box")
    if (suggestBox.lastElementChild !== null) {
        focus(suggestBox.lastElementChild);
    }
}

function focusUp(line) {
    if (line == null || line.previousElementSibling == null) {
        focusLast()
    } else {
        focus(line.previousSibling)
    }
}

function focusDown(line) {
    if (line == null || line.nextElementSibling == null) {
        focusFirst()
    } else {
        focus(line.nextSibling)
    }
}

function substitute(line) {
    if (line != null) {
        let input = document.querySelector(".suggest__input")
        input.value = line.getAttribute("data-text")
        showSuggest([])
    }
}

function suggestKeyHandler(event) {
    let lineFocused = document.querySelector(".suggest__suggest-line_focused")
    if (event.code == "ArrowUp") {
        focusUp(lineFocused)
    }
    if (event.code == "ArrowDown") {
        focusDown(lineFocused)
    }
    if (event.code == "Enter") {
        substitute(lineFocused)
    }
}

setTimeout(() => {
    let input = document.querySelector(".suggest__input")
    input.addEventListener("input", onKeySuggest)
    input.addEventListener("keydown", suggestKeyHandler)
})
