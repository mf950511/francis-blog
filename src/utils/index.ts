export type FrontMatter = {
  date: string;
  title: string;
  tags: string[];
  slug?: string;
  categories: string;
}

export type BlogItem = {
  node: {
    frontmatter: FrontMatter;
    fields: {
      slug: string
    }
  }
}

type YearMapBlog = {
  [year: string]: FrontMatter[]
}

export const sortDataByDate = (blogList: BlogItem[]): YearMapBlog => {
  return blogList.reduce((target: YearMapBlog, blogItem) => {
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
