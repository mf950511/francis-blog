import * as React from 'react'
import { graphql, useScrollRestoration } from 'gatsby'
import Layout from '../components/Layout'
import TagPanel from '../components/TagPanel'
import { sortDataByDate } from '../utils/index.js'

const BlogPanel = ({data, pageContext}) => {
  const sortedData = sortDataByDate(data.allMarkdownRemark.edges)
  const currentScrollRestoration = useScrollRestoration(`blog-category-${pageContext.category}`)

  return (
    <Layout scrollRestoration={currentScrollRestoration}>
      {
        Object.keys(sortedData).map(key => {
          let tagBlogNode = sortedData[key]
          return (
            <TagPanel key={key} tagBlogNode={tagBlogNode} year={key}/>
          )
        })
      }
    </Layout>
  )
}

export default BlogPanel

export const query = graphql`
  query($tag: String) {
    allMarkdownRemark(
      filter: {frontmatter: {tags: {in: [$tag] }}}
    ) {
      edges{
        node{
          fields{
            slug
          }
          frontmatter{
            date(formatString:"YYYY:MM-DD")
            tags
            categories
            title
          }
        }
      }
    }
  }
`