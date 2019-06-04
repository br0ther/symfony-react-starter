import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';

import Clock from './Components/Clock';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

function isSearched(searchTerm) {
    return function (item) {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

class Search extends Component {
    render() {
        const {value, onChange} = this.props;
        return (
            <form>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                />
            </form>
         );
    }
}

class Table extends Component {
    render() {
        const { list, pattern, onDismiss } = this.props;
        return (
            <div>
            {list.filter(isSearched(pattern)).map(item =>
                    <div key={item.objectID}>
                        <span>
                            <a href={item.url}>{item.title}</a>
                        </span>
                        <span>{item.author}</span>
                        <span>{item.num_comments}</span>
                        <span>{item.points}</span>
                        <span>
                            <Button onClick={() => onDismiss(item.objectID)}>
                                Dismiss
                            </Button>
                        </span>
                    </div>
                )}
            </div>
        );
    }

}

class Button extends Component {
    render() {
        const {
            onClick,
            className = '',
            children
        } = this.props;
        return (
            <button
                onClick={onClick}
                className={className}
                type="button"
            >
                {children}
            </button>
        );
    }
}

class List extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    setSearchTopStories(result) {
        this.setState({ result });
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    onDismiss(id) {
        function isNotId(item) {
            return item.objectID !== id;
        }
        const updatedHits = this.state.result.hits.filter(isNotId);

        this.setState({
            result: { ...this.state.result, hits: updatedHits }
        });
    }

    componentDidMount() {
        fetch(url)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    render() {
        const {searchTerm, result} = this.state;

        console.log(this.state);

        if (!result) {
            return null;
        }

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                    />
                    <Table
                        list={result.hits}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                    />
                </div>
            </div>
        );
    }
}

function App() {
    return (
        <div>
            <Clock/>
            <List/>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root'))
;
