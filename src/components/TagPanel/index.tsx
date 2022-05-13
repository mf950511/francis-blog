import React from 'react'
import { Link } from 'gatsby'
import CategoryAndTagInfo from '../CategoryAndTagInfo'
import './tagPanel.scss'

const TagPanel = ({year, tagBlogNode}) => {
  return (
    <section className="archives-container">
      <div className="archive-year">
        {year}
      </div>
      <div className="archive">
        {
          tagBlogNode.map((blog) => (
            <article className="archive-article" key={blog.title}>
              <header className="archive-article-header">
                <div className="archive-title-container">
                  <div className="archive-title">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </div>
                  <time>{blog.date}</time>
                </div>
                <div className="tagInfoWrapper">
                  <CategoryAndTagInfo category={blog.categories} tags={blog.tags}/>
                </div>
              </header>
            </article>
          ))
        }
      </div>
    </section>
  )
}

export default TagPanel
