import styled from 'styled-components'

const LinkHeader = styled.div`
  h3 {
    color: black;
    text-decoration: none; /* Remove underline */
    transition: color 0.3s ease; /* Add smooth color transition */

    &:hover {
      text-decoration: underline; /* Add underline on hover */
      cursor: pointer;
  }
`

export default LinkHeader