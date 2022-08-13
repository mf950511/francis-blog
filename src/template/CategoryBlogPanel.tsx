import * as React from 'react'
import { graphql, useScrollRestoration } from 'gatsby'
import Layout from '../components/Layout'
import TagPanel from '../components/TagPanel'
import { sortDataByDate, BlogItem } from '../utils/index'

type PropsType = {
  data: {
    allMarkdownRemark: {
      edges: BlogItem[]
    }
  }
  pageContext: {category: string}
}


const BlogPanel = ({data, pageContext}: PropsType) => {
  const sortedData = sortDataByDate(data.allMarkdownRemark.edges)
  const currentScrollRestoration = useScrollRestoration(`blog-category-${pageContext.category}`)
  
  return (
    <Layout scrollRestoration={currentScrollRestoration}>
      <>
        {
          Object.keys(sortedData).map(key => {
            let tagBlogNode = sortedData[key]
            return (
              <TagPanel key={key} tagBlogNode={tagBlogNode} year={key}/>
            )
          })
        }
      </>
    </Layout>
  )
}

export default BlogPanel

export const query = graphql`
  query($category: String) {
    allMarkdownRemark(filter: {frontmatter: {categories: {in: [$category] }}}) {
      edges {
        node {
          fields{
            slug
          }
          frontmatter {
            date(formatString: "YYYY:MM-DD")
            title
            categories
            tags
          }
        }
      }
    }
  }
`