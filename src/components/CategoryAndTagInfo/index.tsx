import React from 'react'
import { Link } from 'gatsby'
import './index.scss'
const CategoryAndTagInfo = ({category, tags}) => {
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