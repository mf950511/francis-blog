import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import TagPanel from '../components/TagPanel'
import { sortDataByDate } from '../utils/index.js'

const BlogPanel = ({data}) => {
  const sortedData = sortDataByDate(data.allMdx.nodes)
  return (
    <Layout>
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
    allMdx(filter: {frontmatter: {tags: {in: [$tag] }}}) {
      nodes {
        frontmatter {
          date(formatString: "YYYY:MM-DD")
          title
          categories
          tags
        }
        body
        slug
      }
    }
  }
`