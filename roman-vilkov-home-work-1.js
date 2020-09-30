function maxItemAssociation(arr) {
    let result = []
    const countEl = {}
    let temp = 0
    let maxRec = null
    arr.forEach(el => el.forEach(elem => countEl.hasOwnProperty(elem) ? countEl[elem]++ : countEl[elem] = 1))

    for(let key in countEl) {
        if( temp < countEl[key] ) {
            temp = countEl[key] 
            maxRec = key
        }
    }

    arr.forEach(el => { if(el.includes(maxRec)) result.push(el) })
    
    return result.flat().filter((item, index, arr) => arr.indexOf(item) === index).sort()
}