// TODO: [ -- : knxm ] ===================================================
// * My custom kxn rule

// Round to two decimals.
var Zero = '.00'
const twoRound = function (n) {
   return +(Math.round(n + "e+2") + "e-2");
}

// Define the structure of the kxn rule.
const knxm = function (g) {
   let [k, x, n, dg] = [g['k'], g['x'], g['n'], '']

   // [y.k] [y.x] [y.n]
	let [kStr, nStr] = ['', '']
   let [kDot, nDot] = [k.includes('.'), n.includes('.')]

   // Transform the values to the correct data type and then do the calculations
   if (!kDot) {
      let kInt = parseInt(k)
      if (!nDot) {
         let nInt = parseInt(n)
         kStr = `${kInt * nInt}`
         nStr = `${nInt - 1}`
      } else {
         let nFlt = parseFloat(n)
         kStr = `${twoRound(kInt * nFlt)}`
         nStr = `${twoRound(nFlt - 1)}`
      }
   } else {
      let kFlt = parseFloat(k)
      if (!nDot) {
         let nInt = parseInt(n)
         kStr = `${twoRound(kFlt * nInt)}`
         nStr = `${nInt - 1}`
      } else {
         let nFlt = parseFloat(n)
         kStr = `${twoRound(kFlt * nFlt)}`
         nStr = `${twoRound(nFlt - 1)}`
      }
   }

   // Remove all kxn with k = "0"
   dg = kStr === '0' ? '0' : kStr + x + '^' + nStr

   return dg
}

// TODO: [ dy: DyKxn ] ==================================================
// * My JS Module: 01

// Check in there is any empty input field.
const existsXY = function (w, g) {   
   if (w === '' && g === '') {
      return 'Fill in both input fields.'
   } else if (w === '' && g !== '') {
      return 'Fill in the field f(a literal).'
   } else if (w !== '' && g === '') {
      return 'Fill in the fild = (a math func).'
   } else {
      return ''
   }
}

// Convert all literals to the same.
const lowercaseXY = function (w, g) {
   let [upper, lower] = [w.toUpperCase(), w.toLowerCase()]
   if (w === upper) {
      if (!g.includes(upper) && g.includes(lower)) {
         g = g.replaceAll(lower, upper)
      }
   }
   if (w === lower) {
      if (!g.includes(lower) && g.includes(upper)) {
         g = g.replaceAll(upper, lower)
      }
   }
   return g
}

// In a str, find a set of strs and replace them with another.
const replaceStrY = function (g, another, slice) {
   slice.forEach(sgn => {
      if (g.includes(sgn)) {
         g = g.replaceAll(sgn, another)
      }
   })
	return g
}

// Verify if the math func was written correctly.
const correctlyXY = function (w, g) {

   // Convert all literals to the same.
   g = lowercaseXY(w, g)

   // Does the value x repeat twice?
	if (g.includes(w.repeat(2))) {
		return ['g', "The expression contains two literals together."]
	}

   // Check if there is the same number of Parentheses.
   if (g.includes('(') || g.includes(')')) {
      let nOpen = (g.split('(').length - 1)
		let nClose = (g.split(')').length - 1)
		if (nOpen > nClose) {
			let n = String(nOpen - nClose)
			return ['g', `The expression needs ${n} close parenthesis signs.`]
		}
      if (nOpen < nClose) {
         let n = String(nClose - nOpen)
			return ['g', `The expression needs ${n} open parenthesis signs.`]
		}
	}

   // Remove all signs and numbers from a math expression.
   let sSign = [w, '.', '^', '+', '-', ' ', '(', ')',
   '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
   let nStr = replaceStrY(g, '', sSign)

   // Check for signs or literals other than normal.
   if (nStr !== '') {
      return ['g', 'The expression contains literals of const type.']
   }

   return [g, '']
}

// Remove blank spaces between a sign and a number.
const directSign = function(g) {
	let sSign = ['+', '-']
   sSign.forEach(sgn => {
      if (g.includes(sgn+' ')) {
         g = g.replaceAll(sgn+' ', sgn)
      }
   })
   return g
}

// Split str type math func into Kx^n expression.
const splitY = function (g) {
   // '+ n' => '+n'
   g = directSign(g)

   // Divide the math func by its blanks.
	if (g.includes(' ')) {
		return g.trim().split(' ')
	} else {
		return [g]
	}
}

// Finish building kxn for future operations.
const finishBuildingKxn = function (w, kxn) {
	if (!kxn.includes(w+'^')) {
		kxn = kxn.replaceAll(w, w+'^1')

		if (kxn.includes('-'+w)) {
			kxn = kxn.replaceAll(w, '1'+w)

		} else if (kxn.includes('+'+w)) {
			kxn = kxn.replaceAll(w, '1'+w)
		}
	} else {
		if (kxn.includes('-'+w)) {
			kxn = kxn.replaceAll(w, '1'+w)

		} else if (kxn.includes('+'+w)) {
			kxn = kxn.replaceAll(w, '1'+w)
		}
	}
   return kxn
}

// kx^n → (kn)x^(n-1). For a single expression.
const theKxnRule = function(w, kxn) {

	// All x or kx => kx^1
	kxn = finishBuildingKxn(w, kxn)

	// Index: "x" & Remove: "x^"
	let [im, ie] = [kxn.indexOf(w), kxn.length]
	kxn = kxn.replaceAll(w+'^', '')

   // ["k" => k] & ["n" => n]
	let [kStr, nStr] = [kxn.slice(0,im), kxn.slice(im,ie)]

	// Define a struct Kxn{}
	let dKxn = {k: kStr, x: w, n: nStr}
   
   // There is an error? // let err = ''
   kxn = knxm(dKxn)

   // Set "w^0" to "".
	kxn = kxn.endsWith(w+'0') ? kxn.replace(w+'^0', ''):kxn
   return kxn
}

// Add blank spaces between a sign and a number.
const redirectSign = function (kxn) {
	// For all kxn other that "".
	if (kxn !== '') {

		// Add the missing signs.
		if (kxn.startsWith('+')) {
			kxn = ' ' + kxn
		} else if (!kxn.startsWith('-')) {
			kxn = ' +' + kxn
		} else {
			kxn = ' ' + kxn
		}

		// Adjust signs  " + " or " - "
		let sSign = [' +', ' -']
      sSign.forEach(sgn => {
         if (kxn.includes(sgn)) {
            kxn = kxn.replace(sgn, sgn+' ')
         }
      })
	}

   return kxn
}

// kx^n → (kn)x^(n-1). For one or more expressions.
function DyKxn(w, g) {

   // Are there empty input fields?
	let err = existsXY(w, g)
   if (err !== '') {
      return ['🤔', err]
   }

   // Was the math func written correctly?
	[g, err] = correctlyXY(w, g)
	if (err !== '') {
      return ['🤔', err]
   }

   // Split on the expression Kx^n.
	let sKxn = splitY(g)

   // Execute the rule Kx^n for each expression.
	// Doesn't take into account numbers without literal.
   let dg = ''
   for (let i in sKxn) {
      if (sKxn[i].includes(w)) {

         // Add the + sign when it is only x
         let moreLess = sKxn[i].startsWith('+') || sKxn[i].startsWith('-')
         if (i === '0' && !moreLess) {
            
            // Adjust the sign of the first kxn.
            sKxn[i] = '+' + sKxn[i]

            // Apply the rule.
				sKxn[i] = theKxnRule(w, sKxn[i])
         
         } else {
            // Apply the rule.
				sKxn[i] = theKxnRule(w, sKxn[i])
         }

         // Adjust signs.
         dg += i === '0' ? sKxn[i] : redirectSign(sKxn[i])
      
      } else {
         // Adjust signs.
			dg += i === '0' ? '0':' + 0';
      }
   }

   // Sum all kxn with the same "x^n"
	[w, dg] = AddKxn(w, dg)

   return [w, dg]
}

// Todo: [ dy: AddKxn ] ============================================
// * My GO Module: 02

// Store K and N in different sets.
const kSetNset = function (w, sKxn) {
   for (let i in sKxn) {
      sKxn[i] = finishBuildingKxn(w, sKxn[i])
	}

	// Store K and N in different sets.
	let [sN, ssFlt] = [[], []]
	for (let i  in sKxn) {
      
      // Split kxn into k and n.
		let skn = sKxn[i].split(w+'^')
      
		// Convert k to float.
		let kFlt = parseFloat(skn[0])
      
		// Convert n to float.
		let nFlt = parseFloat(skn[1])
      
		// Save the new k and n.
		sN[i] = nFlt
		ssFlt[i] = [kFlt, nFlt]
	}

	return [sN, ssFlt]
}

// Numbers from highest to lowest.
const highToLowNum = function (s) {
	var temp = 0
	for (let x in s) {
		for (let y in s) {
			if (s[x] > s[y]) {
				temp = s[x]
				s[x] = s[y]
				s[y] = temp
			}
		}
	}
	return s
}

// Remove all duplicate n in Y.
const rmDuplicateN = function (slice) {
   return highToLowNum([...new Set(slice)])
}

// Add all the k's with the same n.
function addKs(sN, ssFlt) {

	let [t1, sskn] = [0, []]
   
	// Store all [k++, n], according to its same n.
	for (let n of sN) {
      
      let [t2, sn] = [0, []]
      
		// Store all [k, n], according to its same n.
		for (let i in ssFlt) {
         if (n === ssFlt[i][1]) {
            sn[t2] = [ssFlt[i][0], ssFlt[i][1]]
				t2++
			}
		}
      
      // Sum all elements k.
		let k = 0
		for (let i in sn.slice(0, t2)) {
         k += sn[i][0]
		}
      
		// Save all the [k, n] new.
		sskn[t1] = [k, n]
		t1++
	}

	return sskn
}

// Rebuild all the kxn, after having added them with their corresponding.
const rebuildAllKxn = function(w, sskn) {

	var sknStr = ''
	for (let i in sskn) {

		// Convert float to string.
		let kStr = `${twoRound(sskn[i][0])}`
      let nStr = `${twoRound(sskn[i][1])}`

		// Rebuild all the Kxn func.
		let kxn = kStr + w + '^' + nStr

      // Remove all 1, 0, ^1, ^0
      if (kStr === '0') {
         kxn = '0'
      } else if (kStr === '1' && nStr === '0') {
         kxn = kStr
      } else if (kStr === '1' && nStr === '1') {
         kxn = w
      } else if (kStr !== '1' && nStr === '1') {
         kxn = kStr + w
      } else if (kStr !== '1' && nStr === '0') {
         kxn = kStr
      } else if (kStr === '1' && nStr !== '0' && nStr !== '1') {
         kxn = w + '^' + nStr
      }

		// Add space between the sign.
		sknStr += i === '0' ? kxn : redirectSign(kxn)
	}

	return sknStr
}

// Sum all similar Kx^n, with the same x^n.
function AddKxn(w, g) {

	// Are there empty input fields?
	let err = existsXY(w, g)
   if (err !== '') {
      return ['🤔', err]
   }

   // Was the math func written correctly?
	[g, err] = correctlyXY(w, g)
	if (err !== '') {
      return ['🤔', err]
   }

	// Split on the expression Kx^n.
	let sKxn = splitY(g)

	let dTerm = ''
   for (let i in sKxn) {
		if (sKxn[i].includes(w)) {

			// Add the + sign when it is only x
         let moreLess = sKxn[i].startsWith('+') || sKxn[i].startsWith('-')
			if (!moreLess) {
				sKxn[i] = '+' + sKxn[i]
			}

         // All x or kx => kx^1
         sKxn[i] = finishBuildingKxn(w, sKxn[i])

         // Adjust signs.
         dTerm += i === '0' ? sKxn[i] : redirectSign(sKxn[i])

		} else {

         // Adjust signs.
			dTerm += i === '0' ? sKxn[i] + w + '^0' : (
            dTerm += directSign(' ' + sKxn[i] + w + '^0')
         )
		}
	}

	// Divide back into expression Kx^n.
	sKxn = splitY(dTerm)

	// Store k and n in different sets.
	let [sN, ssFlt] = kSetNset(w, sKxn)
   
	// * Remove all duplicate Kxn.
	sN = rmDuplicateN(sN)
   
	// Add all the k's.
	let sskn = addKs(sN, ssFlt)
   
	// Rebuild all the kxn.
	g = rebuildAllKxn(w, sskn)
   
	return [w, g]
}
