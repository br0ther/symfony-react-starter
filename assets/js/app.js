import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';

import Clock from './Components/Clock';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class Table extends Component {
    render() {
        const { list, onDismiss } = this.props;
        return (
            <div>
            {list.map(item =>
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

class List extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
        };

        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => this.setState({ error }));
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    onDismiss(id) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];

        function isNotId(item) {
            return item.objectID !== id;
        }
        const updatedHits = hits.filter(isNotId);

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        });
    }

    onSearchSubmit() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });

        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopStories(searchTerm);
    }

    render() {
        const {searchTerm, results, searchKey, error} = this.state;

        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];

        console.log(this.state);

        if (error) {
            return <p>Something went wrong.</p>;
        }

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}

                    >
                        Search
                    </Search>
                    <Table
                        list={list}
                        onDismiss={this.onDismiss}
                    />
                    <div className="interactions">
                        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                            More
                        </Button>
                    </div>
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

// "block body" syntax
const Search = ({
        value,
        onChange,
        onSubmit,
        children
    }) => {
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
            />
            <button type="submit">
                {children}
            </button>
        </form>
    );
};

// "concise body" syntax
const Button = ({
    onClick,
    className = '',
    children,
    }) =>
    <button
        onClick={onClick}
        className={className}
        type="button"
    >
        {children}
    </button>;

ReactDOM.render(
    <App />,
    document.getElementById('root'))
;
