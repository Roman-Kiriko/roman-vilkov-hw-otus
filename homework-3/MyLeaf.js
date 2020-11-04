import createColor from './utills'
export default class MyLeaf extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({mode:'open'})
        const el = document.createElement('div')
        const style = document.createElement('style')
        style.textContent = `div {
            margin: 20px;
            height: 10rem;
            background-color: #${createColor()}
        }`

        shadow.appendChild(style)
        shadow.appendChild(el)

    }
}