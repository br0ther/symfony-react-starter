import React from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';

import Clock from './Components2/Clock';
import List from './Components2/List';

function App() {
    return (
        <div>
            <Clock/>
            <List/>
        </div>
    )
}

export default App;

ReactDOM.render(
    <App />,
    document.getElementById('root'))
;
