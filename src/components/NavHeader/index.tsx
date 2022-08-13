import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import cat from '../../common/images/cat.jpg'
import './index.scss'

const NavHeader = ({className}: {className?: string}) => {
  const data = useStaticQuery(
  graphql`
    query{
      site {
        siteMetadata {
          author
          authorDesc
        }
      }
    }
  `
  )
  return (
    <header className={`nav ${className}`}>
      <div className="overlay"></div>
      <Link to="/" className="nav-img-container">
        <img src={cat} alt="nav cat"/>
      </Link>
      <hgroup>
        <h2 className="nav-author-name">
          <Link to="/">{data.site.siteMetadata.author}</Link>
        </h2>
        <p className="nav-author-describe">{data.site.siteMetadata.authorDesc}</p>
      </hgroup>
      <ul className="nav-list">
        <li><Link to="/">博客首页</Link></li>
        <li><Link to="/">博客首页</Link></li>
        <li><Link to="/">FCC算法详解</Link></li>
        <li><Link to="/">FCC算法详解</Link></li>
      </ul>
    </header>
  )
}

export default NavHeader