import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  body {
    margin: 3rem;
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
`;

export default GlobalStyles