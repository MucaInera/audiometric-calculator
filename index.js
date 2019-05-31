const calculateTheory = require('./theories')

/*
 * Sample config
 * {
 *   age: 36,
 *   height: 1.78,
 *   weight: 93,
 *   sex: 'm',
 *   type: 'pistelli2007',
 *   vc: 1,
 *   fvc: 2.1,
 *   fev1: 2.1,
 *   date: '31/05/2019'
 * }
 */
module.exports = (config = {}) => {
  const errorMessages = {
    age: 'Eta mancante. Si prega di verificare i dati anagrafici del lavoratore.',
    height: 'Altezza mancante. Si prega di verificare i dati della scheda "Esame Obiettivo".',
    sex: 'Sesso mancante. Si prega di verificare i dati anagrafici del lavoratore.',
    type: 'Theory not setted'
  }

  const errors = []

  Object.entries(errorMessages).forEach(([key, value]) => {
    if (!config[key]) {
      const tmpError = {}

      tmpError[key] = value

      errors.push(tmpError)
    }
  })

  if (errors.length) {
    throw errors
  }

  return calculateTheory(config)
}
