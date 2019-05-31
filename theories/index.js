const ceca = require('./ceca')
const ers = require('./ers')
const paoletti = require('./paoletti')
const { pistelli2000, pistelli2007 } = require('./pistelli')

module.exports = (config) => {
  const theories = {
    ceca: ceca,
    ers: ers,
    paoletti: paoletti,
    pistelli2000: pistelli2000,
    pistelli2007: pistelli2007
  }

  if (theories[config.type]) {
    return theories[config.type](config)
  }

  throw new Error('Teoria non trovata')
}
