module.exports = {
  hParseFloat: (number) => {
    return parseFloat(number).toFixed(2)
  },
  hJoinString: (strings, joiner = '') => {
    return strings.join(joiner)
  },
  messages: {
    configNotFound: (configName) => {
      return 'Configurazione "' + configName + '" non trovata'
    }
  }
}
