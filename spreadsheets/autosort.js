/*

TODO: add documentation

Adding in cell A1:
autosort(A3:E50,-+)
This will sort the range A3:E50
by the first column descending
and the socound column ascending

*/

sorter_version = "2020-07-17"

function onEdit(event) {
    let sheet = event.source.getActiveSheet()
    // sheet.getRange("D1").setValue(sheet.getActiveCell().getA1Notation())
    let formulaRange = sheet.getRange("A1")
    let [fName, sRange, sOrder] = formulaRange.getValue().split(/[,()]/)

    if (fName == 'autosort') {
        sheet.getRange("B1").setValue(sorter_version)
        colorizeRange2(sheet, sRange)
        let range = sheet.getRange(sRange)
        let orders = (sOrder || '+').split("")
        let sorters = orders.reduce(function (newSorter, symbol, index) {
            return newSorter.concat({ column: index + 1, ascending: symbol == '+' })
        }, [])
        range.sort(sorters)
    }
}

function colorizeRange2(sheet, sortRangeString) {

  fromTo = sortRangeString.split(':')
  rowEnd = parseInt(fromTo[0].replace(/[a-zA-Z]+/g,''))-1
  colEnd = fromTo[1].replace(/[0-9]+/,'')

  colorizeRange(sheet.getRange("A1:" + colEnd + rowEnd))
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

function logInCell() {
    let text = ''
    for (let i = 0; i < arguments.length; i++) {
        text += text == '' ? arguments[i] : ", " + arguments[i]
    }
    let logCell = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("C1")
    logCell.setValue((logCell.getValue() ? logCell.getValue() + '\n' : '') + text)
}
