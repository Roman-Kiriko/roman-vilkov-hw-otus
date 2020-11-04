 const json = require('./tree.json')
 import MyLeaf from './MyLeaf'
 import MyTree from './MyTree'

 customElements.define('my-tree', MyTree)
 customElements.define('my-leaf', MyLeaf)

 window.addEventListener('load', () => {
     itarateJson(json)
 })
 const body = document.querySelector('body')

 function createTree(id, parent = body) {
     const tree = document.createElement('my-tree')
     tree.setAttribute('id', id)
     parent.prepend(tree)
     return tree
 }

 function createLeaf(id = '', parent) {
     const leaf = document.createElement('my-leaf')
     leaf.setAttribute('id', id)
     parent.append(leaf)
     return leaf
 }

 let uniqueId = []
 function itarateJson(obj, element) {
     let el = element
     let id
     for (let key in obj) {
         if (obj.hasOwnProperty(key)) {
             if (key === 'id') {
                 id = obj[key]
             }
             if(Object.keys(obj).length > 1) {
                if(!uniqueId.includes(id)) el = createTree(id, el)
                uniqueId.push(id)
             }
             if (Object.keys(obj).length < 2) {
                 createLeaf(id, el)
             }
             if (key === 'items') {
                 if (Array.isArray(obj[key])) {
                     if (obj[key].length > 1) {
                         obj[key].forEach(e => {
                                itarateJson(e, el)

                         })
                     } else {
                         itarateJson(obj[key][0], el)
                     }
                 }
             }
         }
     }
     return el
 }