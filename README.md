# JS-Playground
A swift playground inspired tool for playing around with JS

[Demo](http://rossmackay.co/JS-Playground/) to play around with (barebones styling and still buggy atm)

Note: currently all lines must start with `var`, a variable name or a number and be on a single line. Functions need to have `toString()` appended.

## Examples:
![demo](https://cloud.githubusercontent.com/assets/2717635/7338316/4085acac-ec40-11e4-90f3-258d71db0feb.gif)

Input                            | Output
-------------------------------- | -------------
`var x = 10`                     | 10
`y = x * 5`                      | 50
`x++`                            | 11
`10 + 5`                         | 15
`json = JSON.stringify({y: y})`  | {"y":50}
`name = 'joe'`                   | joe
`greeting = 'hello ' + name`     | hello joe

## Todo
- [ ] About/description page
- [ ] Styling
- [x] ~~Append `toString` to functions?~~
- [ ] Stringify objects
- [ ] Multiline support
- [ ] Execute functions
- [ ] Type checking for arrays
- [ ] Type checking for math starting with brackets
- [ ] ES6 Support?
- [ ] Commented lines stop subsequent lines matching up
