import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './reducers/store'
import App from './App'
import GlobalStyles from './components/styles/GlobalStyle'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <GlobalStyles />
    <App />
  </Provider>
)

export default store