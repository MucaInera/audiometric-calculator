const globalTheoryConfig = require('./config')
const { hParseFloat, hJoinString } = require('../helpers')
const { commonCalculate, getCecaErsPaoletti } = require('./common')

const pistelli = (config) => {
  const {age = 0, fvc = 0, vc = 0, fev1 = 0, height, weight, type, date} = config

  const theoryConfig = globalTheoryConfig[hJoinString(['pistelli', type, config.sex.toLowerCase()], '_')]

  if (!theoryConfig) {
    throw new Error(messages.configNotFound(hJoinString(['pistelli', type, config.sex.toLowerCase()], '_')))
  }

  let mBmi, mBmi2, mSpline1, mSpline2, b1, b2, b3, b4, b5, mI1, mI2, mVfc, ppFvc, mVc, ppVc, mFev1, ppFev1, livNormale = 0

  let mRestriz = 'N'

  if (!weight) {
    throw new Error('Peso mancante. Si prega di verificare i dati della scheda "Esame Obiettivo".')
  }

  mBmi = weight / ((height / 100) * (height / 100))

  mBmi2 = mBmi * mBmi

  // Calcolo FVc
  if (fvc > 0) {
    if (age >= theoryConfig.sfvcbreakpoint1) {
      mI1 = 1
    }

    if (age >= theoryConfig.sfvcbreakpoint2) {
      mI2 = 1
    }

    b1 = (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange)

    b2 = (theoryConfig.etafinerange - theoryConfig.sfvcbreakpoint1)

    b3 = (theoryConfig.etafinerange - theoryConfig.etainiziorange)

    b4 = ((age - theoryConfig.sfvcbreakpoint1) * (age - theoryConfig.sfvcbreakpoint1) * (age - theoryConfig.sfvcbreakpoint1)) * mI1

    mSpline1 = ((0 - b1) * b2 / b3) + b4

    b1 = (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange)

    b2 = (theoryConfig.etafinerange - theoryConfig.sfvcbreakpoint2)

    b3 = (theoryConfig.etafinerange - theoryConfig.etainiziorange)

    b4 = ((age - theoryConfig.sfvcbreakpoint2) * (age - theoryConfig.sfvcbreakpoint2) * (age - theoryConfig.sfvcbreakpoint2)) * mI2

    mSpline2 = parseFloat((0 - b1) * b2 / b3) + parseFloat(b4)

    mFvc = parseFloat(theoryConfig.sfvcconstant) + parseFloat(theoryConfig.sfvcbmi * mBmi) + parseFloat(theoryConfig.sfvcbmisquared * mBmi2) + parseFloat(theoryConfig.sfvcheight * height) + parseFloat(theoryConfig.sfvcheightsquared * (height * height)) + parseFloat(theoryConfig.sfvcage * age) + parseFloat(theoryConfig.sfvcagespline1 * mSpline1) + parseFloat(theoryConfig.sfvcagespline2 * mSpline2)

    ppFvc = fvc * 100 / mFvc

    if (ppFvc < 80) {
      mRestriz = 'S'
      a5 = ' Fev1/Fvc nella norma con Fvc '
    }
  }

  // Calcolo Vc
  if (vc > 0) {
    if (age >= theoryConfig.svcbreakpoint1) {
      mI1 = 1
    }

    if (age >= theoryConfig.svcbreakpoint2) {
      mI2 = 1
    }

    b1 = (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange)

    b2 = (theoryConfig.etafinerange - theoryConfig.svcbreakpoint1)

    b3 = (theoryConfig.etafinerange - theoryConfig.etainiziorange)

    b4 = (age - theoryConfig.svcbreakpoint1) * (age - theoryConfig.svcbreakpoint1) * (age - theoryConfig.svcbreakpoint1)

    b4 = b4 * mI1

    mSpline1 = ((0 - b1) * b2 / b3) + b4

    b1 = (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange)

    b2 = (theoryConfig.etafinerange - theoryConfig.svcbreakpoint2)

    b3 = (theoryConfig.etafinerange - theoryConfig.etainiziorange)

    b4 = (age - theoryConfig.svcbreakpoint2) * (age - theoryConfig.svcbreakpoint2) * (age - theoryConfig.svcbreakpoint2)

    b4 = b4 * mI2

    mSpline2 = ((0 - b1) * b2 / b3) + b4

    mVc = parseFloat(theoryConfig.svcconstant) + parseFloat(theoryConfig.svcbmi * mBmi) + parseFloat(theoryConfig.svcbmisquared * mBmi2) + parseFloat(theoryConfig.svcheight * height) + parseFloat(theoryConfig.svcheightsquared * (height * height)) + parseFloat(theoryConfig.svcage * age) + parseFloat(theoryConfig.svcagespline1 * mSpline1) + parseFloat(theoryConfig.svcagespline2 * mSpline2)

    ppVc = vc * 100 / mVc

    if (ppFvc < 80) {
      mRestriz = 'S'
      a5 = ' Fev1/Vc nella norma con Vc '
    }
  }

  // Calcolo FEV1
  if (fev1 > 0) {
    if (age >= theoryConfig.sfev1breakpoint1) {
      mI1 = 1
    }

    if (age >= theoryConfig.sfev1breakpoint2) {
      mI2 = 1
    }

    b1 = (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange)

    b2 = (theoryConfig.etafinerange - theoryConfig.sfev1breakpoint1)

    b3 = (theoryConfig.etafinerange - theoryConfig.etainiziorange)

    b4 = (age - theoryConfig.sfev1breakpoint1) * (age - theoryConfig.sfev1breakpoint1) * (age - theoryConfig.sfev1breakpoint1)

    b4 = b4 * mI1

    mSpline1 = ((0 - b1) * b2 / b3) + b4

    b1 = (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange) * (age - theoryConfig.etainiziorange)

    b2 = (theoryConfig.etafinerange - theoryConfig.sfev1breakpoint2)

    b3 = (theoryConfig.etafinerange - theoryConfig.etainiziorange)

    b4 = (age - theoryConfig.sfev1breakpoint2) * (age - theoryConfig.sfev1breakpoint2) * (age - theoryConfig.sfev1breakpoint2)

    b4 = b4 * mI2

    mSpline2 = parseFloat((0 - b1) * b2 / b3) + parseFloat(b4)

    mFev1 = parseFloat(theoryConfig.sfev1constant) + parseFloat(theoryConfig.sfev1bmi * mBmi) + parseFloat(theoryConfig.sfev1bmisquared * mBmi2) + parseFloat(theoryConfig.sfev1height * height) + parseFloat(theoryConfig.sfev1heightsquared * (height * height)) + parseFloat(theoryConfig.sfev1age * age) + parseFloat(theoryConfig.sfev1agespline1 * mSpline1) + parseFloat(theoryConfig.sfev1agespline2 * mSpline2)

    ppFev1 = fev1 * 100 / mFev1

    livNormale = (parseFloat(theoryConfig.sfev1fvcconstant) + parseFloat(theoryConfig.sfev1fvcbmi * mBmi) + parseFloat(theoryConfig.sfev1fvcbmisquared * mBmi2) + parseFloat(theoryConfig.sfev1fvcheight * height) + parseFloat(theoryConfig.sfev1fvcheightsquared * (height * height)) + parseFloat(theoryConfig.sfev1fvcage * age)) * 100
  }

  return commonCalculate({vc, fvc, fev1, mFvc, ppFvc, mVc, ppVc, mFev1, ppFev1, livNormale, mRestriz, a5, date, theoryConfig})
}

module.exports = {
  pistelli2000: (config) => {
    return pistelli({
      ...config,
      type: 2000
    })
  },
  pistelli2007: (config) => {
    return pistelli({
      ...config,
      type: 2007
    })
  },
}
