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
    width: 100%;
    overflow-x:auto;
  }

  th, td {
    padding: 5px;
    text-align: left;
  }

  tbody {
    tr {
      &:hover {
        background-color: #ccdae8;
        transition: color 0.3s ease;
      }
    }
  }

  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .booking-form-popup {
    position: fixed; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    z-index: 999; 
  }

  label {
    width: 160px;
    font-size: 16px;
  }

  input {
    flex-grow: 1;
    max-width: 300px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }
  
  input[type="checkbox"] {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  .rbc-addons-dnd-row-body {
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }

  .rbc-time-header-content > .rbc-row.rbc-row-resource {
    border-bottom: 0;
  }

  .rbc-header {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    background-color: white;
    border-bottom: 0;
  }

  // .rbc-event {
  //   opacity: 0.7;  
  // }
`

export default GlobalStyles