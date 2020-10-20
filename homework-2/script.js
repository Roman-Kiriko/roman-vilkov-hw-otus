function getPath(selector) {
    let result = []

    while (selector !== document.body) {
        if (selector.id) {
            result.push(`#${selector.id}`)
        } else if (!selector.previousElementSibling && selector.nextElementSibling) {
            result.push(`${selector.localName}:first-child`)
        } else if (selector.previousElementSibling && !selector.nextElementSibling) {
            result.push(`${selector.localName}:last-child`)
        } else if (selector.previousElementSibling && selector.nextElementSibling) {
            result.push(`${selector.localName}:nth-child(${getSelectorPosition(selector)})`)
        } else {
            result.push(selector.localName)
        }
        selector = selector.parentNode
    }
    result.push('body')
    return result.reverse().join(' ')
}

function getSelectorPosition(selector) {
    let elems = selector.parentNode.children
    for (let i = 0; i <= elems.length; i++) {
        if (selector === elems[i]) return i + 1
    }
}