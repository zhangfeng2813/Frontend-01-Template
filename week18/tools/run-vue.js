const compiler = require('@vue/compiler-sfc') 

let output = compiler.compileTemplate({
    filename: 'exaple.vue',
    source: '<div>123</div>'
})

console.log(output)