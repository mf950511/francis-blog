import Typography from 'typography'
import altonTypography from 'typography-theme-alton'
altonTypography.baseFontSize = '16px'
altonTypography.overrideThemeStyles = ({ rhythm }, options) => ({
  'span, h1 , h2, h3, h4, h5, h6, p': {
    color: '#999'
  },
  "ul, ol": {
    margin: '0'
  }
})
const typography = new Typography(altonTypography)
export default typography

