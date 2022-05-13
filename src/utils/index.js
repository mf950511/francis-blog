export const sortDataByDate = (blogList) => {
  return blogList.reduce((target, blogItem) => {
    const { frontmatter: { date: yearAndDate, ...blogOtherInfo }, slug } = blogItem
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
