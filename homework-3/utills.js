export default function createColor() {
    let result = []
    for (let i = 0; i < 3; i++) {
        let color = (Math.floor(Math.random() * 255)).toString(16)
        result.push(color.length < 2 ? '0' + color : color)
    }
    return result.join('')
}