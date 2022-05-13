import * as React from 'react'
import { useStaticQuery,graphql } from "gatsby"
import './layout.scss'

const Layout = ({children}) => {
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
    <div className="container">
      <header className="header-left"></header>
      <div className="content">
        <header className="header-top"></header>
        <main className="main">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout