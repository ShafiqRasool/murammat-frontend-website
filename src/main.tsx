import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { UIProvider } from './Context/UIContext'
import { DataProvider } from './Context/DataContext'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <UIProvider>
      <DataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataProvider>
    </UIProvider>
  </Provider>
)
