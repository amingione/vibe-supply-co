import appleFritterPdf from '../docs/hemp/COA-122/COA 122 - Apple Fritter Hybrid.pdf?url'
import appleFritterQr from '../docs/hemp/COA-122/QR/apple-fritter-coa-qr.png'
import pineappleExpressPdf from '../docs/hemp/COA-122/US_CBD_-_Pineapple_Express.pdf?url'
import pineappleExpressQr from '../docs/hemp/COA-122/QR/pineapple-express-coa-qr.png'
import halleBerryPdf from '../docs/hemp/COA-122/US_CBD_-_Halle_Berry.pdf?url'
import halleBerryQr from '../docs/hemp/COA-122/QR/halle-berry-coa-qr.png'

// One record per supplied certificate. Every hemp/COA page, Vercel rewrite and
// QR code is derived from this list, so adding a product means adding one entry
// here (plus its PDF and QR under docs/hemp/) and a rewrite in vercel.json.
//
// `label` is only present when label artwork was supplied alongside the report;
// nothing on the pages is attributed to a label we have not seen.
export const HEMP_PRODUCTS = [
  {
    slug: 'apple-fritter-hybrid',
    name: 'Apple Fritter',
    fullName: 'Apple Fritter Hybrid',
    titleLines: ['Apple Fritter', 'Hybrid.'],
    kind: 'Flower · Hybrid',
    reportLabel: 'COA 122',
    reportRef: 'COA 122 · Sample 250986',
    sample: '250986',
    laboratory: 'Excelbis Labs',
    completed: 'May 5, 2026',
    pdf: appleFritterPdf,
    qr: appleFritterQr,
    note: (
      <>
        The supplied report lists <strong>24.718% total THC</strong> for sample 250986. The supplied label
        artwork says total THC is below 0.3%; those figures conflict. Use the original report to review the
        measurements. This page does not establish legal compliance or confirm that a particular package
        matches the tested sample.
      </>
    ),
    label: {
      ingredients: '100% hemp flower. Nothing added.',
      storage: 'Store sealed in a cool, dry place away from light. Reseal after opening.',
      warnings: [
        'Keep out of reach of children and pets. Not for ingestion. Intoxication possible when heated. May cause drowsiness or intoxication; do not drive or operate machinery after use.',
        'Do not use if pregnant or nursing. Hemp products may result in a positive drug test. Consult a physician before use if you have a medical condition.',
      ],
    },
  },
  {
    slug: 'pineapple-express',
    name: 'Pineapple Express',
    fullName: 'Pineapple Express',
    titleLines: ['Pineapple', 'Express.'],
    kind: 'Flower · Cured',
    reportLabel: 'Sample 396357',
    reportRef: 'Sample 396357 · Client US CBD',
    sample: '396357',
    laboratory: 'Excelbis Labs',
    completed: 'July 16, 2026',
    pdf: pineappleExpressPdf,
    qr: pineappleExpressQr,
    note: (
      <>
        The supplied report lists total THC as <strong>ND (not detected)</strong> and{' '}
        <strong>17.254% total CBD</strong> for sample 396357, with 12.1% moisture. Use the original report to
        review the measurements, detection limits, and methods. This page does not establish legal compliance
        or confirm that a particular package matches the tested sample.
      </>
    ),
  },
  {
    slug: 'halle-berry',
    name: 'Halle Berry',
    fullName: 'Halle Berry',
    titleLines: ['Halle', 'Berry.'],
    kind: 'Flower · Cured',
    reportLabel: 'Sample 280075',
    reportRef: 'Sample 280075 · Client US CBD',
    sample: '280075',
    laboratory: 'Excelbis Labs',
    completed: 'July 17, 2026',
    pdf: halleBerryPdf,
    qr: halleBerryQr,
    note: (
      <>
        The supplied report lists total THC as <strong>ND (not detected)</strong> and{' '}
        <strong>15.401% total CBD</strong> for sample 280075, with 11.0% moisture. Use the original report to
        review the measurements, detection limits, and methods. This page does not establish legal compliance
        or confirm that a particular package matches the tested sample.
      </>
    ),
  },
]

export function findHempProduct(prefix, path) {
  return HEMP_PRODUCTS.find((product) => path === `${prefix}/${product.slug}`) ?? null
}
