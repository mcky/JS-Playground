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
		var val = eval(varName)
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
		, varName
		, arrayString
	for (var i = 0; i < totalLines; i++) {
		lines = editor.session.getLines(0, i)
		lastLine = lines[lines.length-1]
		if (lastLine) {
			varName = lastLine.split(' ')[0]
			if (!isNaN(varName)) {
				varName = lastLine
			}
			arrayString = arrayToString(lines)
			theWorker.evaluateCode(arrayString, varName)
		}
	}
}

outputButton.addEventListener('click', generateOutput, false)
generateOutput()
