const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if(node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({node, getNode, basePath: `blog`})
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const tagPanelTemplate = path.resolve('./src/template/TagBlogPanel.tsx')
  const categoryPanelTemplate = path.resolve('./src/template/CategoryBlogPanel.tsx')
  const blogListTemplate = path.resolve('./src/template/BlogList.tsx')
  return new Promise((resolve) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
                categories
              }
            }
          }
        }
      }
    `).then(result => {
      if(result.errors) {
        throw result.errors
      }
      // 博客列表页面
      const totalBlogCount = result.data.allMarkdownRemark.edges.length
      const postsPerPage = 10
      const totalPageCount = Math.ceil(totalBlogCount / postsPerPage)
      for(let i = totalPageCount; i > 0; i--) {
        createPage({
          path: i === 1 ? `/` : `/page/${i}`,
          component: blogListTemplate,
          context: {
            limit: postsPerPage,
            skip: (i - 1) * postsPerPage,
            currentPage: i,
            totalBlogCount,
            totalPageCount
          },
        })
      }
      // category 页面与 tag 页面
      let allTags = []
      const allCategories = []
      result.data.allMarkdownRemark.edges.forEach((nodeData) => {
        nodeData = nodeData.node
        allTags = allTags.concat(nodeData.frontmatter.tags)
        allCategories.push(nodeData.frontmatter.categories)
      })
      const noRepeatedTags = Array.from(new Set(allTags))
      const noRepeatedCategories = Array.from(new Set(allCategories))
      noRepeatedTags.forEach(tag => {
        createPage({
          path:`tag/${tag}`,
          component: tagPanelTemplate,
          context: {
            tag
          }
        })
      })
      noRepeatedCategories.forEach(category => {
        createPage({
          path:`category/${category}`,
          component: categoryPanelTemplate,
          context: {
            category
          }
        })
      })
      resolve() 
    })
  })
}