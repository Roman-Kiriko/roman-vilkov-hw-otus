const fs = require('fs')

const tree = {},
    files = [],
    dirs = []

async function treeFiles(pathFolder) {
    if (!dirs.includes(pathFolder)) dirs.push(pathFolder.replace(/\.\.\//g, ''))
    const dir = await fs.promises.opendir(pathFolder)
    for await (const dirent of dir) {
        const file = `${pathFolder}/${dirent.name}`
        dirent.isDirectory() ? await treeFiles(file) : files.push(file.replace(/\.\.\//g, ''))
    }
    tree.files = files
    tree.dirs = dirs
    return tree
}

treeFiles(process.argv[2])
    .then(tree => JSON.stringify(tree))
    .then(json => fs.writeFile('tree.json', json, (err) => {
        if (err) throw err
        console.log('The file has been saved!');
    }))
    .catch(console.error)

module.exports = treeFiles