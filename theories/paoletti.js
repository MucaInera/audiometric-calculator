const globalTheoryConfig = require('./config')
const { hParseFloat, hJoinString } = require('../helpers')
const { commonCalculate, getCecaErsPaoletti } = require('./common')

module.exports = (config) => {
  const {age = 0, fvc = 0, vc = 0, fev1 = 0, height} = config

  const configs = {
    f: [
      {
        to: 11,
        config: 'paoletti_f_0_11'
      },
      {
        from: 12,
        to: 17,
        config: 'paoletti_f_12_17'
      },
      {
        from: 18,
        to: 20,
        config: 'paoletti_f_18_20'
      },
      {
        from: 21,
        config: 'paoletti_f_21'
      }
    ],
    m: [
      {
        to: 13,
        config: 'paoletti_m_0_13'
      },
      {
        from: 14,
        to: 28,
        config: 'paoletti_m_14_28'
      },
      {
        from: 29,
        config: 'paoletti_m_29'
      }
    ]
  }

  const configName = configs[config.sex.toLowerCase()].filter(tmpConfig => {
    if ((!tmpConfig.from || tmpConfig.from < age) && (!tmpConfig.to || tmpConfig.to > age)) {
      return true
    }

    return false
  })[0] || {}

  const theoryConfig = globalTheoryConfig[configName.config]

  if (!theoryConfig) {
    throw new Error(messages.configNotFound(configName.config))
  }

  return commonCalculate(getCecaErsPaoletti(theoryConfig, config))
}
