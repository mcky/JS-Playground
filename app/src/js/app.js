var ace = require('brace')
	, BuildBridgedWorker = require('./bridged-worker')
	, editor = ace.edit('js')
	, jsEditor = document.getElementById('js')
	, outputList = document.getElementById('outputList')
	, outputButton = document.getElementById('outputButton')

require('brace/mode/javascript')
editor.getSession().setMode('ace/mode/javascript')

var workerCode = function () {
	"use strict;"

	evaluateCode = function(code, varName) {
		// Lol eval()
		eval(code)
		var val = eval(varName).toString()
		main.printOutput(val)
	}
}

var outputArray = []
var printOutput = function(val) {
	outputArray.push(val)
	outputList.innerHTML = ''
	var outputItem
	for (var i = 0; i < outputArray.length; i++) {
		outputItem = document.createElement("li")
    	outputItem.innerHTML = outputArray[i]
    	outputList.appendChild(outputItem)
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

var generateOutput = function() {
	outputArray = []
	var totalLines = editor.session.getLength()
		, lines
		, lastLine
		, lineNum
		, varName
		, arrayString
		, splitAtDot
		, splitAtSpace

	for (var i = 0; i < totalLines; i++) {
		lines = editor.session.getLines(0, i)
		lastLine = lines[lines.length-1].trim()
		lineNum = i+1

		if (lastLine && lastLine.length > 0) {
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

			arrayString = arrayToString(lines)
			theWorker.evaluateCode(arrayString, varName)
		}
	}
}

outputButton.addEventListener('click', generateOutput, false)
generateOutput()
