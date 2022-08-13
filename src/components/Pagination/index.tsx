import * as React from 'react'
import { Link } from 'gatsby'
import './index.scss'

type PropsType = {
  pageCount: number;
  currentIndex: number;
  baseUrl: string;
}

const Pagination = ({pageCount, currentIndex, baseUrl}: PropsType) => {
  if(pageCount === 1) {
    return null
  }
  const prevLink = currentIndex === 2 ? '/' : `${baseUrl}${(currentIndex - 1)}`
  const prevClassName = `${currentIndex === 1 ? 'hide' : 'show'}`
  return (
    <div className="pagination">
      <Link className={prevClassName} to={prevLink}>« Prev</Link>
      {
        Array.from({length: pageCount}).map((item, index) => {
          return (
            <Link 
              to={`${index === 0 ? '/' : `${baseUrl}${(index + 1)}`}`} 
              className={`pagination-item ${currentIndex === (index + 1) ? 'current' : ''}`} 
              key={index}
            >
              {index+1}
            </Link>
          )
        })
      }
      <Link className={`${currentIndex < pageCount ? 'show' : 'hide'}`} to={`${baseUrl}${currentIndex + 1}`}>Next »</Link>
    </div>
  )
}
export default Pagination