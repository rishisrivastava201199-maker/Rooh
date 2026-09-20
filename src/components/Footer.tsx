import Link from "next/link";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <ul className="ftr-promise">
          <li>
            <p className="pt">Dispatched in 24 hours</p>
            <p>On orders placed before 4 pm, Monday to Saturday.</p>
          </li>
          <li>
            <p className="pt">Seven-day returns</p>
            <p>Unopened, in original packaging. We cover return shipping on defects.</p>
          </li>
          <li>
            <p className="pt">Pay your way</p>
            <p>UPI, cards, netbanking and wallets. COD up to ₹5,000.</p>
          </li>
          <li>
            <p className="pt">Answered by a person</p>
            <p>WhatsApp and email, usually within a working day.</p>
          </li>
        </ul>

        <div className="ftr-grid">
          <div>
            <p className="brand" style={{ padding: 0 }}>ROOH</p>
            <hr className="rule-brass" style={{ width: 64, margin: "var(--s5) 0" }} />
            <p className="lead" style={{ fontSize: "var(--t-small)" }}>
              Indian fragrance, composed honestly. Eau de parfum at 18% concentration and
              traditional itra, made in India and sold without an inflated MRP.
            </p>
          </div>

          <div className="ftr-cols">
            <div>
              <h2>Shop</h2>
              <Link href="/shop">Perfumes</Link>
              <Link href="/attars">Itra</Link>
              <Link href="/discovery">Discovery</Link>
              <Link href="/gifts">Gift sets</Link>
            </div>
            <div>
              <h2>Discover</h2>
              <Link href="/fragrance-finder">Fragrance finder</Link>
              <Link href="/collections">Collections</Link>
              <Link href="/journal">Journal</Link>
              <Link href="/about">Our story</Link>
            </div>
            <div>
              <h2>Help</h2>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/help">Contact</Link>
            </div>
            <div>
              <h2>Connect</h2>
              <Link href="/help">Instagram</Link>
              <Link href="/help">Facebook</Link>
              <Link href="/help">WhatsApp</Link>
              <Link href="/track">Track an order</Link>
            </div>
          </div>
        </div>

        <div className="ftr-legal">
          <p>
            © {new Date().getFullYear()} ROOH Fragrance. Marketed by ROOH Fragrance.
            Manufactured by a licensed third-party unit; manufacturer name, address and
            cosmetic licence number are printed on each carton. Prices include GST.
            Longevity and sillage vary with skin, climate and application.
          </p>
          <div className="row wrapf" style={{ gap: "var(--s5)" }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/shipping">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
