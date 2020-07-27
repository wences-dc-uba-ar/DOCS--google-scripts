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

sorter_version = "2020-07-27"

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


function update_timestamp(sheet, sortRange) {
    let titles = sheet.getRange(sortRange.getRow() - 1, sortRange.getColumn(), 1, sortRange.getWidth()).getValues()
    for (var i in titles[0]) {
        if(titles[0][i].toLowerCase() == 'updated') {
            let updatedColumn = parseInt(i)+1
            let editedRow = sheet.getCurrentCell().getRow()
            set_mtime(sheet, editedRow, updatedColumn)
            fadeColors(sheet, sortRange, editedRow, updatedColumn)
        }
    }
}

function set_mtime(sheet, editedRow, updatedColumn) {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let timeString = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -8).replace('T', ' ')
    range = sheet.getRange(editedRow, updatedColumn).setValue(timeString)
}

function fadeColors(sheet, sortRange, editedRow, updatedColumn) {
    updatedRange = sheet.getRange(sortRange.getRow(), updatedColumn, sortRange.getHeight(),1)
    fadeout(sheet, updatedRange)

    updatedRow = sheet.getRange(editedRow, updatedColumn)

    updatedRow.setBackground('#000')
    updatedRow.setFontColor('#FFF')
}


function fadeout(sheet, range) {
    // FIXME: estos loops son muy lentos, buscar otra manera
    let backgrounds = range.getBackgrounds()
    let fontColors = range.getFontColors()
    for (var i in backgrounds) {
        for (var j in backgrounds[i]) {
            color = backgrounds[i][j]
            if(color!='#ffffff') {
                r = addHexa(color[1], +2)
                g = addHexa(color[3], +2)
                b = addHexa(color[5], +2)
                sheet.getRange(range.getRow()+parseInt(i), range.getColumn()+parseInt(j)).setBackground(`#${r}${g}${b}`)
                fontColor = fontColors[i][j]
                r = addHexa(fontColor[1], -2)
                g = addHexa(fontColor[3], -2)
                b = addHexa(fontColor[5], -2)
                sheet.getRange(range.getRow()+parseInt(i), range.getColumn()+parseInt(j)).setFontColor(`#${r}${g}${b}`)
            }
        }
    }
}

function addHexa(h, i) {
    let hexa = '0123456789ABCDEF'
    n = hexa.indexOf(h.toUpperCase()) + i

    n = Math.max(0,n)
    n = Math.min(15,n)

    return hexa[n]
}
