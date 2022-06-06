// TODO: Form Inputs ===============
const Z = document.getElementById('z')
Z.setAttribute('type', 'text')
Z.setAttribute('name', 'z')
Z.setAttribute('maxlength', '1')
Z.setAttribute('aria-label', 'Input for the literal.')

const Dz = document.getElementById('dz')
Dz.setAttribute('type', 'text')
Dz.setAttribute('name', 'dz')
Dz.setAttribute('minlength', '1')
Dz.setAttribute('aria-label', 'Input for a math func.')

const X = document.getElementById('X')
X.setAttribute('type', 'text')
X.setAttribute('name', 'X')
X.setAttribute('maxlength', '1')
X.setAttribute('aria-label', 'Input for the literal.')

const Y = document.getElementById('Y')
Y.setAttribute('type', 'text')
Y.setAttribute('name', 'Y')
Y.setAttribute('minlength', '1')
Y.setAttribute('aria-label', 'Input for a math func.')


// TODO: Form Buttons ===============
const R = document.getElementById('R')
R.addEventListener('click', e=>{
   Z.setAttribute('value', 'x')
   Dz.setAttribute('value', 'knx^(n-1) + nx^(n-1) + k - 1')
})

const S = document.getElementById('S')
S.addEventListener('click', e=>{

   let vX = document.getElementById("X").value;
   let vY = document.getElementById("Y").value;

   let [w, dg] = DyKxn(vX, vY)

   Z.setAttribute('value', w)
   Dz.setAttribute('value', dg)
})


/* ========== Form Inputs ========== */
