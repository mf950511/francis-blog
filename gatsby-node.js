const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const tagPanelTemplate = path.resolve('./src/template/TagBlogPanel.tsx')
  const categoryPanelTemplate = path.resolve('./src/template/CategoryBlogPanel.tsx')
  return new Promise((resolve) => {
    graphql(`
      query loadPagesQuery {
        allMdx {
          nodes {
            frontmatter {
              tags
              categories
            }
          }
        }
      }
    `, {limit: 1000}).then(result => {
      if(result.errors) {
        throw result.errors
      }
      let allTags = []
      const allCategories = []
      result.data.allMdx.nodes.forEach((nodeData) => {
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
      console.log(33333, allTags, noRepeatedTags, allCategories, noRepeatedCategories)
      resolve() 
    })
  })
}