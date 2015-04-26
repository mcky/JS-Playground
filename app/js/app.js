var base_tpl =
    "<!doctype html>" +
    "<html>" +
    "<head>" +
    "<meta charset=\"utf-8\">" +
    "<title>Test</title>" +
    "</head>" +
    "<body>" +
    "</body>" +
    "</html>";

var baseCSS =
    'html,body {'+
        'width: 100%;'+
        'height: 100%;'+
        'margin: 0;'+
        'padding: 0;'+
    '}';

var editor = ace.edit("js");
    editor.getSession().setMode("ace/mode/javascript");

var jsEditor = document.getElementById('js')
    ,renderBtn = document.getElementById('renderBtn')
    ,iframe = document.getElementById('render')


var prepareSource = function() {
    var js = editor.getValue()
        ,src = ''

    var totalLines = editor.session.getLength()

    var varNames = []
    // Shittttt - updating a variable updates it everywhere
    for (var i = 0; i < totalLines; i++) {
        var lines = editor.session.getLines(0, i)
        var lastLine = lines[lines.length-1]
        var varName = lastLine.split(' ')[0]
        // TODO: Check if starts with var or //
        if (!isNaN(varName)) {
            varName = lastLine
        }
        varNames.push(varName)
    };

    js += '\n'
    js += 'var varNames = ' + JSON.stringify(varNames) + ';\n'
    js += 'for (var i = 0; i < varNames.length; i++) {\n'
    js += ' var val = eval(varNames[i])\n'
    js += ' val = val ? val : \' \'\n'
    // Lol eval()
    js += ' console.log(val)\n'
    js += ' var oututLine = document.createElement("div")\n'
    js += ' oututLine.innerHTML = val\n'
    js += ' document.body.appendChild(oututLine)\n'
    js += '}\n'

    src = base_tpl.replace('</body></body>');

    css = '<style>' + baseCSS + '</style>';
    src = src.replace('</head>', css + '</head>');

    js = '<script>' + js + '</script>';
    src = src.replace('</body>', js + '</body>');

    return src;
};

var renderIframe = function() {
    var source = prepareSource()
        ,iframeDoc = iframe.contentDocument;

    iframeDoc.open();
    iframeDoc.write(source);
    iframeDoc.close();
}

renderBtn.addEventListener('click', renderIframe, false);
renderIframe()

editor.commands.addCommand({
    bindKey: {mac: "enter", win: "enter"},
    exec: function() {
        renderIframe()
        return false
    }
})
