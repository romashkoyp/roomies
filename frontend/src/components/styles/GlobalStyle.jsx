import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  
  body {
    padding: 0;
    font-family: "Poppins", sans-serif; 
    color: #333;
    background-color: #f5f5f5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Noto Serif", serif;
    font-weight: 800;
    margin-top: 0;
  }

  p {
    line-height: 1.5;
  }

  a {
    color: grey;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: black;
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
    
  .booking-form-popup {
    max-width: 350px;
    width: 70%;
    position: fixed; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1em 2em 2em 2em;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
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
    max-width: 90%;
    font-size: 1em;
  }

  input {
    flex-grow: 1;
    max-width: 170px;
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  .booking-input {
    flex-grow: 1;
    min-width: 170px;
    width: 90%;
    padding: 10px;
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

  .input-container {
    display: flex;
    flex-direction: column;
    align-self: center;
  }

  .error {
    color: #ff5c5c;
    font-size: 0.85em;
    margin-top: 0.2em;
  }

  .sidebar-nav-ul {
    width: 100%;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
  }

  .sidebar-li {
    width: 80%;
    padding: 4% 10% 4% 10%;
    border-radius: 0;
  }

  .menu-button {
    display: none;
  }

  textarea {
    display: flex;
    width: 100%;
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

    @media(max-width: 870px){
    .hideOnMobile{
      display: none;
    }

    .menu-button {
      display: block;
    }
    
    body {
      font-size: small;
    }

    label {
      font-size: small;
    }

    input {
      font-size: small;
    }

  }
`

export default GlobalStyles