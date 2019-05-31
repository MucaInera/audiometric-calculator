const globalTheoryConfig = require('./config')
const { hParseFloat, hJoinString, messages } = require('../helpers')
const { commonCalculate, getCecaErsPaoletti } = require('./common')

module.exports = (config) => {
  const {age = 0, fvc = 0, vc = 0, fev1 = 0, height} = config

  const theoryConfig = globalTheoryConfig['ers_' + config.sex.toLowerCase()]

  if (!theoryConfig) {
    throw new Error(messages.configNotFound('ers_' + config.sex.toLowerCase()))
  }

  return commonCalculate(getCecaErsPaoletti(theoryConfig, config))
}
