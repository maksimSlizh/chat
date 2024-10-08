import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SocketContextProvider } from "./context/socketContext.tsx";
import './styles/app.scss'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <SocketContextProvider>
                <App />
            </SocketContextProvider>
        </BrowserRouter>
    </Provider>
)
