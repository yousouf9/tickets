
import Link from 'next/link'
export default ({currentUser}) => {

  const links = [
    currentUser && {label: 'My Orders', href:"/orders"},
    currentUser && {label: 'Sell Tickets', href:"/tickets/new"},
    currentUser && {label: 'Sign out', href:"/auth/signout"},
    !currentUser && {label: 'Sign In', href:"/auth/signin"},
    !currentUser &&{label: 'Sign Up', href:"/auth/signup"}
  ]
    .filter(linkConfig => linkConfig)
    .map(({label, href}) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      )
    })
  
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href='/'>
        <a className="navbar-brand">Ticks</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  )
}