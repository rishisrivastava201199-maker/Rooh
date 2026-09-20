import Link from "next/link";

export function Crumbs({ trail }: { trail: [label: string, href: string][] }) {
  return (
    <nav className="wrap crumbs" aria-label="Breadcrumb">
      {trail.map(([label, href], i) => (
        <span key={label + i}>
          {i > 0 ? <span aria-hidden="true"> / </span> : null}
          {href ? (
            <Link href={href}>{label}</Link>
          ) : (
            <span aria-current="page">{label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
