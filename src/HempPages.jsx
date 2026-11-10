import './hemp.css'

// Product detail page for one hemp certificate. Reached only from that
// product's QR landing page (/coa/<slug>); there is no index of these pages
// and nothing on the storefront links to them.

function LabLink({ product }) {
  const href = `/coa/${product.slug}`
  return (
    <aside className="hemp-lab" aria-label={`${product.name} laboratory report`}>
      <a href={href} aria-label={`Open ${product.name} Certificate of Analysis`}>
        <img src={product.qr} width="196" height="196" alt={`QR code for the ${product.name} Certificate of Analysis`} />
      </a>
      <div>
        <p className="hemp-eyebrow">{product.reportLabel}</p>
        <h2>Read the lab report.</h2>
        <p>Scan to open on your phone, or follow the link below.</p>
        <a className="button button--coral" href={href}>View lab results ↗</a>
      </div>
    </aside>
  )
}

export default function HempPages({ product }) {
  const { label } = product
  return (
    <div className="hemp-page" id="hemp-content">
      <nav className="hemp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <header className="hemp-intro">
        <p className="hemp-eyebrow">Vibe Smoke &amp; Supply Co. · Adults 21+</p>
        <h1>{product.titleLines[0]}<br /><span>{product.titleLines[1]}</span></h1>
        <p>{`Product information${label ? ', label warnings,' : ''} and the supplied certificate of analysis, together in one place.`}</p>
      </header>

      <section className="hemp-record" aria-labelledby="product-details-title">
        <div>
          <p className="hemp-eyebrow">Product reference</p>
          <h2 id="product-details-title">At a glance.</h2>
          <dl className="hemp-facts">
            <div><dt>Name</dt><dd>{product.fullName}</dd></div>
            <div><dt>Form</dt><dd>Flower — cured</dd></div>
            {label?.ingredients && <div><dt>Label ingredients</dt><dd>{label.ingredients}</dd></div>}
            <div><dt>Report</dt><dd>{product.reportRef}</dd></div>
            <div><dt>Laboratory</dt><dd>{product.laboratory}</dd></div>
            <div><dt>Report completed</dt><dd>{product.completed}</dd></div>
          </dl>
        </div>
        <LabLink product={product} />
      </section>
      <section className="hemp-note" aria-labelledby="report-note-title">
        <p className="hemp-eyebrow">Understanding this report</p>
        <h2 id="report-note-title">Results belong to the tested sample.</h2>
        <p>{product.note}</p>
      </section>
      {label && (
        <section className="hemp-guidance" aria-label="Supplied label information">
          <article>
            <p className="hemp-eyebrow">From the supplied label</p>
            <h2>Storage.</h2>
            <p>{label.storage}</p>
          </article>
          <article>
            <p className="hemp-eyebrow">From the supplied label</p>
            <h2>Warnings · 21+</h2>
            {label.warnings.map((warning) => <p key={warning}>{warning}</p>)}
          </article>
        </section>
      )}

      <p className="hemp-source-note">Product information and label wording are drawn from the supplied materials. Read the original certificate for test methods, results, and limitations.</p>
    </div>
  )
}
