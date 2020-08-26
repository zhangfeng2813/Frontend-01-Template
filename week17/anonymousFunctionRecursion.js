// (g =>
//     (f => f(f))(
//       self =>
//         g( (...args) => self(self).apply(this, args) )
//     )
//   )(
//     self => {
//       return n => n > 0 ? self(n - 1) + n : 0
//     }
//   )(100)

const y = g =>
      (f => f(f))(
        self =>
          g( (...arg) => self(self).apply(this, args) )
      )

let f = y(self => {
  return n => n > 0 ? self(n - 1) + n : 0
})

f(100);