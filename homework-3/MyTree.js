import createColor from './utills'
export default class MyTree extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({mode:'open'})
        const el = document.createElement('div')
        const style = document.createElement('style')
        style.textContent = `div {
            width: 50%;
            margin: 20px;
            background-color: #${createColor()};
        }`
        el.innerHTML = '<slot></slot>'
        shadow.appendChild(style)
        shadow.appendChild(el)
    }
}