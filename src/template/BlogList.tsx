import * as React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import CategoryAndTagInfo from '../components/CategoryAndTagInfo'
import Pagination from '../components/Pagination'
import '../common/css/blog.scss'

const BlogList = ({data, pageContext}) => {
  const allBlogNodes = data.allMarkdownRemark.edges
  return (
    <Layout>
      {
        allBlogNodes.map((edge) => {
          return (
            <div className="blog-detail-container">
              <Link to={`/blog${edge.node.fields.slug}`} className="blog-title">
                <h1>{edge.node.frontmatter.title}</h1>
                <time>{edge.node.frontmatter.date}</time>
              </Link>
              <article className="blog-content">
                <section dangerouslySetInnerHTML={{ __html: edge.node.html.split('<!--more-->')[0] }} />
              </article>
              <div className="blog-read-more-container">
                <CategoryAndTagInfo 
                  category={edge.node.frontmatter.categories} 
                  tags={edge.node.frontmatter.tags}
                />
                <div className="blog-read-more">
                  <Link to={`/blog${edge.node.fields.slug}`}>阅读全文 &gt;&gt;</Link>
                </div>
              </div>
            </div>
          )
        })
      }
      <Pagination pageCount={pageContext.totalPageCount} currentIndex={pageContext.currentPage} baseUrl="/page/"/>
    </Layout>
  )
}

export const query = graphql`
  query ($skip: Int,$limit: Int) {
    allMarkdownRemark(
      limit: $limit
      filter: {
        frontmatter: {date: {ne: null}}
      }
      skip: $skip
      sort: {fields: [frontmatter___date], order:DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            categories
            tags
          }
          html
          fields{
            slug
          }
        }
      }
      
    }
  }
`

export default BlogList