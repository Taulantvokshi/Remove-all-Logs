const { resolve } = require('path');
const { readdir } = require('fs').promises;
const fs = require('fs')

const removeConsole = (dir) => {
    async function* getFiles(dir) {
        const dirents = await readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const res = resolve(dir, dirent.name);

            if (dirent.isDirectory() && dirent.name !== 'node_modules') {
                yield* getFiles(res);
            } else {
                yield res;
            }
        }
    }
    (async () => {
        for await (const f of getFiles(__dirname)) {

            if (f[f.length - 2] + f[f.length - 1] === 'js'
                && f !== resolve()

            ) {
                fs.readFile(f, 'utf8', function (err, data) {
                    if (err) {
                        return err
                    }
                    const word = /console\.log\(([^)]+)\)/igm
                    var result = data.replace(word, '');
                    fs.writeFile(f, result, 'utf8', function (error) {
                        if (err) return err
                    });
                });
            }
        }
    })()
    getFiles(dir)
}
//Call the function with your directory or different path
//removeConsole(__dirname)
