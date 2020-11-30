const treeFiles = require('./script')
const json = require('./tree.json')

test('should create tree files', async () => {
    expect(await treeFiles('foo')).toEqual(json)
})