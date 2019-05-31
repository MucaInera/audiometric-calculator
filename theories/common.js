const { hParseFloat, hJoinString } = require('../helpers')

module.exports = {
  getCecaErsPaoletti: (theoryConfig, config) => {
    const { age = 0, height = 0, vc = 0, fvc = 0, fev1 = 0, date } = config

    let a1, a2, a3, a4, a5, a6 = ''

    let mRestriz = 'N'

    let mFvc, ppFvc, mVc, ppVc, mFev1, ppFev1, livNormale = 0

    // Calcolo FVC
    if (fvc !== 0) {
      mFvc = (theoryConfig.fvccost) + (theoryConfig.fvceta * age) + (theoryConfig.fvchh * height)

      ppFvc = fvc * 100 / mFvc

      if (theoryConfig.fvcperc5thfisso == 0) {
        livNormale = (theoryConfig.fvcperc5theta * age) + (theoryConfig.fvcperc5thaltezza * height) + theoryConfig.fvcperc5thcostante - theoryConfig.fvcperc5thrsd
      } else {
        livNormale = theoryConfig.vcperc5thfisso
      }

      if (ppFvc < 80) {
        mRestriz = 'S'

        a5 = ' FEV1/FVC nella norma con FVC '
      }
    }

    // Calcolo VC
    if (vc !== 0) {
      mVc = theoryConfig.vccost + (theoryConfig.vceta * age) + (theoryConfig.vchh * height)

      ppVc = vc * 100 / mVc

      if (theoryConfig.vcperc5thfisso === 0) {
        livNormale = ((theoryConfig.vcperc5theta * age) + (theoryConfig.vcperc5thaltezza * height) + (theoryConfig.vcperc5thcostante)) * 0.8
      } else {
        livNormale = theoryConfig.vcperc5thfisso
      }

      if (ppFvc < 80) {
        mRestriz = 'S'
        a5 = ' FEV1/VC nella norma con VC '
      }
    }

    // Calcolo FEV1
    if (fev1 != 0) {
      mFev1 = (theoryConfig.fevcost) + (theoryConfig.feveta * age) + (theoryConfig.fevhh * height)

      ppFev1 = fev1 * 100 / mFev1
    }

    return {vc, fvc, fev1, mFvc, ppFvc, mVc, ppVc, mFev1, ppFev1, livNormale, mRestriz, a5, theoryConfig, date}
  },
  commonCalculate: (props) => {
    let { vc, fvc, fev1, mFvc, ppFvc, mVc, ppVc, mFev1, ppFev1, livNormale, a5, mRestriz, theoryConfig, date } = props

    let mTiff = 0

    let a1, a2, a3, a4, a6 = ''

    if (vc > 0 && fev1 > 0) {
      mTiff = fev1 * 100 / vc
    } else if (fvc > 0 && fev1 > 0) {
      mTiff = fev1 * 100 / fvc
    } else {
      throw new Error('Dati Spirometrici mancanti per le Conclusioni')
    }

    a4 = hJoinString(['\n - Rapporto FEV1/VC = ', hParseFloat(mTiff), '% (limite normale = ', hParseFloat(livNormale), '%)'])

    if (vc > 0) {
      a1 = hJoinString([' - VC:   ', vc, ';   Teor.: ', hParseFloat(mVc), ';   %Pred: ', hParseFloat(ppVc), '%;\n'])
    }

    if (fvc > 0) {
      a2 = hJoinString([' - FVC:   ', fvc, ';   Teor.: ', hParseFloat(mFvc), ';   %Pred: ', hParseFloat(ppFvc), '%;\n'])
    }

    if (fev1 > 0) {
      a3 = hJoinString([' - FEV1: ', fev1, ';   Teor.: ', hParseFloat(mFev1), '; %Pred: ', hParseFloat(ppFev1), '%;\n'])
    }

    if (mTiff >= livNormale && mRestriz === 'N') {
      a6 = 'Esame spirometrico nei limiti della norma.'
    } else if (mTiff >= livNormale && mRestriz == 'S') {
  		a6 = hJoinString(['Il Rapporto', a5, 'ridotta, indicano un deficit restrittivo polmonare. E\' necessario determinare la Capacità Polmonare Totale per confermare la restrizione.'])
  	} else {
      const a6Messages = [
        {
          from: 100,
          message: 'Variazione fisiologica'
        },
        {
          from: 69.55,
          to: 99.99,
          message: 'Compromissione ostruttiva polmonare di lieve entità'
        },
        {
          from: 59.55,
          to: 69.54,
          message: 'Compromissione ostruttiva polmonare di moderata entità'
        },
        {
          from: 49.55,
          to: 59.54,
          message: 'Compromissione ostruttiva polmonare di media entità'
        },
        {
          from: 34.55,
          to: 49.54,
          message: 'Compromissione ostruttiva polmonare di grave entità'
        },
        {
          to: 34.55,
          message: 'Compromissione ostruttiva polmonare di grave entità'
        },
        {
          message: 'Compromissione ostruttiva polmonare di entità molto grave'
        }
      ]

      const tmpPpFev = Math.round(ppFev1, 2)

      a6 = a6Messages.filter(a6Message => {
        if ((!a6Message.from || a6Message.from < tmpPpFev) && (!a6Message.to || a6Message.to > tmpPpFev)) {
          return true
        }

        return false
      })[0].message
    }

    return hJoinString([a1, a2, a3, a4, '\n\n', hJoinString([' - CONCLUSIONI:  ', a6, '\n\n']), ' - ', date, ': Valori teorici: ', theoryConfig.nometeo])
  }
}
