import coaQr from '../docs/hemp/COA-122/QR/apple-fritter-coa-qr.png'
import './hemp.css'

function LabLink() {
  return (
    <aside className="hemp-lab" aria-label="Apple Fritter laboratory report">
      <a href="/coa/apple-fritter-hybrid" aria-label="Open Apple Fritter Certificate of Analysis">
        <img src={coaQr} width="196" height="196" alt="QR code for the Apple Fritter Certificate of Analysis" />
      </a>
      <div>
        <p className="hemp-eyebrow">COA 122</p>
        <h2>Read the lab report.</h2>
        <p>Scan to open on your phone, or follow the link below.</p>
        <a className="button button--coral" href="/coa/apple-fritter-hybrid">View lab results ↗</a>
      </div>
    </aside>
  )
}

export default function HempPages({ detail = false }) {
  return (
    <div className="hemp-page" id="hemp-content">
      <nav className="hemp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span>
        {detail ? <><a href="/hemp">Hemp information</a><span aria-hidden="true">/</span><span aria-current="page">Apple Fritter</span></> : <span aria-current="page">Hemp information</span>}
      </nav>
      <header className="hemp-intro">
        <p className="hemp-eyebrow">Vibe Smoke &amp; Supply Co. · Adults 21+</p>
        <h1>{detail ? <>Apple Fritter<br /><span>Hybrid.</span></> : <>Hemp flower.<br /><span>Know the details.</span></>}</h1>
        <p>{detail ? 'Product information, label warnings, and the supplied certificate of analysis, together in one place.' : 'A reference for hemp flower labels and laboratory reports. Start with the product name to find its information and certificate.'}</p>
      </header>

      {!detail ? (
        <section className="hemp-record" aria-labelledby="apple-fritter-title">
          <div>
            <p className="hemp-eyebrow">Flower · Hybrid</p>
            <h2 id="apple-fritter-title">Apple Fritter</h2>
            <p>Read the product information and review the supplied Apple Fritter laboratory report.</p>
            <a className="hemp-text-link" href="/hemp/apple-fritter-hybrid">Product information <span aria-hidden="true">→</span></a>
          </div>
          <LabLink />
        </section>
      ) : (
        <>
          <section className="hemp-record" aria-labelledby="product-details-title">
            <div>
              <p className="hemp-eyebrow">Product reference</p>
              <h2 id="product-details-title">At a glance.</h2>
              <dl className="hemp-facts">
                <div><dt>Name</dt><dd>Apple Fritter Hybrid</dd></div>
                <div><dt>Form</dt><dd>Flower — cured</dd></div>
                <div><dt>Label ingredients</dt><dd>100% hemp flower. Nothing added.</dd></div>
                <div><dt>Report</dt><dd>COA 122 · Sample 250986</dd></div>
                <div><dt>Laboratory</dt><dd>Excelbis Labs</dd></div>
                <div><dt>Report completed</dt><dd>May 5, 2026</dd></div>
              </dl>
            </div>
            <LabLink />
          </section>
          <section className="hemp-note" aria-labelledby="report-note-title">
            <p className="hemp-eyebrow">Understanding this report</p>
            <h2 id="report-note-title">Results belong to the tested sample.</h2>
            <p>The supplied report lists <strong>24.718% total THC</strong> for sample 250986. The supplied label artwork says total THC is below 0.3%; those figures conflict. Use the original report to review the measurements. This page does not establish legal compliance or confirm that a particular package matches the tested sample.</p>
          </section>
          <section className="hemp-guidance" aria-label="Supplied label information">
            <article>
              <p className="hemp-eyebrow">From the supplied label</p>
              <h2>Storage.</h2>
              <p>Store sealed in a cool, dry place away from light. Reseal after opening.</p>
            </article>
            <article>
              <p className="hemp-eyebrow">From the supplied label</p>
              <h2>Warnings · 21+</h2>
              <p>Keep out of reach of children and pets. Not for ingestion. Intoxication possible when heated. May cause drowsiness or intoxication; do not drive or operate machinery after use.</p>
              <p>Do not use if pregnant or nursing. Hemp products may result in a positive drug test. Consult a physician before use if you have a medical condition.</p>
            </article>
          </section>
        </>
      )}
      <p className="hemp-source-note">Product information and label wording are drawn from the supplied materials. Read the original certificate for test methods, results, and limitations.</p>
    </div>
  )
}
