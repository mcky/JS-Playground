var ace = require('brace')
	, BuildBridgedWorker = require('./bridged-worker')
	, editor = ace.edit('js')
	, session = editor.getSession()
	, jsEditor = document.getElementById('js')
	, outputList = document.getElementById('outputList')

require('brace/mode/javascript')
session.setMode('ace/mode/javascript')
editor.setOption("showPrintMargin", false)

var workerCode = function () {
	"use strict;"

	evaluateCode = function(code, varName) {
		var val = varName
			, errors = false
		if (varName !== ' ') {
			try {
				// Lol eval()
				eval(code);
			} catch (e) {
				errors = true
				val = null
			} finally {
				if (!errors) {
					val = eval(varName).toString()
				}
			}
		}
		main.printOutput(val)
	}
}

var outputArray = []
var printOutput = function(val) {
	val = val === null ? 'Error' : val
	outputArray.push(val)
	outputList.innerHTML = ''
	var outputItem

	for (var i = 0; i < outputArray.length; i++) {
		outputItem = document.createElement("li")
    	outputItem.innerHTML = outputArray[i]
    	outputItem.dataset.line = i+1
    	outputItem.className = 'output__line'
    	outputList.appendChild(outputItem)
    	updateHighlightedLine()
	}
}

var theWorker = BuildBridgedWorker(workerCode, ["evaluateCode"], ['printOutput'], [printOutput])

var arrayToString = function(lines) {
	var arrayString = ''
	for (var j = 0; j < lines.length; j++) {
		arrayString += lines[j] + '\n'
	}
	return arrayString
}

var updateHighlightedLine = function() {
	var lineNumber = editor.getSelectionRange().start.row+1
		, activeClass = 'output__line--active'
		, allLines = document.getElementsByClassName('output__line')
		, currentOutputLine = document.querySelector('[data-line="'+lineNumber+'"]')

	if (currentOutputLine) {
		for (var i = 0; i < allLines.length; i++) {
			allLines[i].classList.remove(activeClass)
		}

		currentOutputLine.classList.add(activeClass)
	}
}


var generateOutput = function() {
	outputArray = []
	var totalLines = editor.session.getLength()
		, lines
		, lastLine
		, lineNum
		, varName
		, arrayString
		, isComment
		, splitAtDot
		, splitAtSpace

	for (var i = 0; i < totalLines; i++) {
		lines = editor.session.getLines(0, i)
		lastLine = lines[lines.length-1].trim()
		lineNum = i+1
		isComment = lastLine.substring(0, 2) == '//'

		if (lastLine && lastLine.length > 0 && !isComment) {
			splitAtDot = lastLine.split('.')
			splitAtSpace = lastLine.split(' ')

			if (!isNaN(lastLine.charAt(0))) {
				console.log('['+lineNum+'] starts with a number')
				varName = lastLine
			} else if (~lastLine.indexOf('function')) {
				console.log('['+lineNum+'] contains the string function')
				lastLine = lastLine.toString()
				varName = splitAtSpace[splitAt]
			} else if (splitAtSpace.length >= 2) {
				console.log('['+lineNum+'] contians a space')
				varName = lastLine.substring(0, 3) === 'var' ? splitAtSpace[1] : splitAtSpace[0]
			} else if (splitAtDot.length >= 2) {
				console.log('['+lineNum+'] contains a full stop')
				varName = splitAtDot[0]
			} else {
				console.log('['+lineNum+'] none of the above')
			}
		} else {
			varName = ' '
		}

		arrayString = arrayToString(lines)
		theWorker.evaluateCode(arrayString, varName)
	}
}

generateOutput()
editor.on("change", generateOutput)
session.selection.on("changeCursor", updateHighlightedLine)
