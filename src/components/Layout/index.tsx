import * as React from 'react'
import { useStaticQuery,graphql } from "gatsby"
import NavHeader from '../NavHeader'
import 'prismjs/themes/prism-okaidia.css'
import './layout.scss'

const Layout = ({children, className}) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <div className={`container ${className}`}>
      <header className="header-left">
        <NavHeader />
      </header>
      <div className="content">
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