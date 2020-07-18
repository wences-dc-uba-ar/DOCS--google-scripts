/*

TODO:
- auto expand sheet to fit range
- auto shrink sheet to range if the rest is empty
- add documentation

Adding in cell A1:
autosort(A3:E50,-+)
This will sort the range A3:E50
by the first column descending
and the socound column ascending

*/

sorter_version = "2020-07-18"

function onEdit(event) {
    let sheet = event.source.getActiveSheet()
    let formulaRange = sheet.getRange("A1")
    let [fName, sRange, sOrder] = formulaRange.getValue().split(/[,()]/)

    if (fName == 'autosort') {
        let range = sheet.getRange(sRange)
        update_timestamp(sheet, range)
        let orders = (sOrder || '+').split("")
        let sorters = orders.reduce(function (newSorter, symbol, index) {
            if ('-+'.includes(symbol)) {
                return newSorter.concat({ column: index + 1, ascending: symbol == '+' })
            }
            return newSorter
        }, [])
        range.sort(sorters)
    }
}

function colorizeRange(range) {
    let hexa = '0123456789ABCDEF'
    let r = r16(Math.random() * 16)
    let g = r16(Math.random() * 16)
    let b = r16(Math.random() * 16)

    let background = '#' + hexa[r] + hexa[g] + hexa[b]
    let text = '#' + hexa[r16(r - 6)] + hexa[r16(g - 6)] + hexa[r16(b - 6)]

    range.setBackground(background)
    range.setFontColor(text)
}

function r16(n) {
    return (Math.floor(n) % 16 + 16) % 16
}


function update_timestamp(sheet, sortRange) {
    let titles = sheet.getRange(sortRange.getRow() - 1, sortRange.getColumn(), 1, sortRange.getWidth()).getValues()
    for (var i in titles[0]) {
        if(titles[0][i].toLowerCase() == 'updated') {
            set_mtime(sheet, parseInt(i)+1)
        }
    }
}

function set_mtime(sheet, y) {
    let x = sheet.getCurrentCell().getRow()
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let timeString = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -8).replace('T', ' ')
    range = sheet.getRange(x,y).setValue(timeString)
    colorizeRange(range)
}