import logo from './logo.svg';
import './App.css';
import AppContext from './contexts/AppContext';
import { Provider } from 'react-redux'
import routes from './RootRoutes';

const App = () => {
    return (
        <AppContext.Provider routes={routes} >
            <Provider store={store}>

            </Provider>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                    Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        </AppContext.Provider>
    );
}

export default App;
