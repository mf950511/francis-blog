import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import CategoryAndTagInfo from '../../components/CategoryAndTagInfo'
import { FrontMatter } from '../../utils/index'
import '../../common/css/blog.scss'

type PropsType = {
  data: {
    markdownRemark: {
      frontmatter: FrontMatter;
      html: string;
    }
  }
}

const BlogPost = ({data}: PropsType) => {
  return (
    <Layout>
      <div className="blog-detail-container">
        <div className="blog-title">
          <h1>{data.markdownRemark.frontmatter.title}</h1>
          <time>{data.markdownRemark.frontmatter.date}</time>
        </div>
        <CategoryAndTagInfo 
          category={data.markdownRemark.frontmatter.categories} 
          tags={data.markdownRemark.frontmatter.tags}
        />
        <article className="blog-content">
          <section dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
        </article>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    markdownRemark(id: {eq: $id}) {
      html
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        categories
        tags
      }
    }
  }
`

export default BlogPost