import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from '../components/Layout'
import 'prismjs/themes/prism-okaidia.css'

const IndexPage = ({data}) => {
  return (
    <Layout>
      <p>this is test page</p>
      {
        data.allMdx.nodes.map(node => (
          <article key={node.id}>
            <h2>{node.frontmatter.title}</h2>
            <p>Posted: {node.frontmatter.date}</p>
            <Link to={`/blog/${node.slug}`}>
              {node.frontmatter.title}
            </Link>
            <Link to={`/blog/${node.frontmatter.categories}`}>
              {node.frontmatter.categories}
            </Link>
            {
              node.frontmatter.tags.map(item => {
                return (
                  <Link to={`/blog/${item}`}>
                    {item}
                  </Link>
                )
              })
            }
          </article>
        ))
      }
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          categories
          tags
        }
        id
        body
        slug
      }
    }
  }
`
export default IndexPage
