# audiometric-calculator
### Usage
```
const calculator = require('audiometric-calculator')

try {
  const message = calculator({
    {
      age: 36,
      height: 1.78,
      weigth: 93,
      sex: 'm',
      type: 'pistelli2007', // ceca || ers || paoletti || pistelli2000 || pistelli2007
      vc: 1,
      fvc: 2.1,
      fev1: 2.1,
      date: '31/05/2019'
    }
  })
} catch (e) {}
```
