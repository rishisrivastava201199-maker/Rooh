import { inr } from "@/lib/format";

export function Price({
  price,
  mrp,
  large,
  showOff,
}: {
  price: number;
  mrp?: number;
  large?: boolean;
  showOff?: boolean;
}) {
  const off = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return (
    <span className={large ? "price price-lg" : "price"}>
      <span className="now">{inr(price)}</span>
      {off > 0 && mrp ? <span className="was">{inr(mrp)}</span> : null}
      {off > 0 && showOff ? <span className="off">{off}% launch price</span> : null}
    </span>
  );
}
