import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  body {
    margin: 1.5rem;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    color: #333;
    background-color: #f5f5f5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-top: 0;
  }

  p {
    line-height: 1.5;
  }

  a {
    color: grey; /* Set the default link color */
    text-decoration: none; /* Remove underline */
    transition: color 0.3s ease; /* Add smooth color transition */

    &:hover {
      color: black; /* Change color on hover */
      //text-decoration: underline; /* Add underline on hover */
    }
  }

  table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
  }

  table {
    margin: auto;
    width: 90%;
  }

  th, td {
    padding: 5px;
  }

  tbody {
    tr {
      &:hover {
        background-color: #ccdae8;
        transition: color 0.3s ease;
      }
    }
  }

`

export default GlobalStyles