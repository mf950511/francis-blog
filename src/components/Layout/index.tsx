import * as React from 'react'
import NavHeader from '../NavHeader'
import 'prismjs/themes/prism-okaidia.css'
import './layout.scss'

type PropType = {
  children: React.ReactElement;
  className?: string;
  scrollRestoration?: any
}

const Layout = ({children, className, scrollRestoration}: PropType) => {

  return (
    <div className={`container ${className}`}>
      <header className="header-left">
        <NavHeader />
      </header>
      <div className="content" {...scrollRestoration}>
        <header className="header-top">
          <NavHeader />
        </header>
        <main className="main">
          {children}
        </main>
      </div>
    </div>
  )
}



export default Layout