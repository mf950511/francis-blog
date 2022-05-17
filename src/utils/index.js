export const sortDataByDate = (blogList) => {
  return blogList.reduce((target, blogItem) => {
    const { frontmatter: { date: yearAndDate, ...blogOtherInfo }, fields: { slug } } = blogItem.node
    const [year, date] = yearAndDate.split(':')
    const tagBlogInfo = {
      ...blogOtherInfo,
      date,
      slug
    }
    target[year] = target[year] || []
    target[year].push(tagBlogInfo)
    return target
  }, {})
}
