import React from 'react'
import { Link } from 'gatsby'
import './index.scss'

type PropsType = {
  category: string;
  tags: string[]
}

const CategoryAndTagInfo = ({category, tags}: PropsType) => {
  return (
    <div className="tag-info-container">
      <div className="tag-info__category">
        <Link to={`/category/${category}`}>{category}</Link>
      </div>
      <div className="tag-info__list">
        {
          tags.map((tag) => (
            <div key={tag} className="tag">
              <Link to={`/tag/${tag}`}>{tag}</Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default CategoryAndTagInfo