import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App.jsx'
import GlobalStyles from './components/styles/GlobalStyle'
import store from './reducers/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <GlobalStyles />
    <Router>
      <App />
    </Router>
  </Provider>
)

export default store