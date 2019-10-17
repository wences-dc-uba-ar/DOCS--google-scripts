/*

TODO: add documentation

Adding in cell A1: 
    autosort(A3:E50,-+)
This will sort the range A3:E50
by the first column descending
and the socound column ascending

*/

function onEdit(event) {
    var sheet = event.source.getActiveSheet()
    // var editedCell = sheet.getActiveCell()
    var formulaRange = sheet.getRange("A1")
    var parts = formulaRange.getValue().split(/[,()]/)

    switch (parts[0]) {
        case 'autosort':
            colorizeRange(sheet.getRange(parts[1].replace(/[0-9]+/g, 1)))
            var range = sheet.getRange(parts[1])
            var orders = (parts[2] || '+').split("")
            var sorters = orders.reduce(function (newSorter, symbol, index) {
                return newSorter.concat({ column: index + 1, ascending: symbol == '+' })
            }, [])
            range.sort(sorters)
            break
    }
}

function colorizeRange(range) {
    var hexa = '0123456789ABCDEF'
    var r = r16(Math.random() * 16)
    var g = r16(Math.random() * 16)
    var b = r16(Math.random() * 16)
    
    var background = '#' + hexa[r] + hexa[g] + hexa[b]
    var text = '#' + hexa[r16(r - 6)] + hexa[r16(g - 6)] + hexa[r16(b - 6)]
    
    range.setBackground(background)
    range.setFontColor(text)
}

function r16(n) {
    return (Math.floor(n) % 16 + 16) % 16
}

function logInCell() {
    var text = ''
    for (var i = 0; i < arguments.length; i++) {
        text += text == '' ? arguments[i] : ", " + arguments[i]
    }
    var logCell = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("C1")
    logCell.setValue((logCell.getValue() ? logCell.getValue() + '\n' : '') + text)
}

