import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';

import Clock from './Components/Clock';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '30';

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
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const oldHits = page !== 0
            ? this.state.result.hits
            : [];
        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            result: {hits: updatedHits, page}
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
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

    onSearchSubmit(event) {
        const { searchTerm } = this.state;

        this.fetchSearchTopStories(searchTerm);
        //No effect, so i'm commented this
        // event.preventDefault();
    }

    componentDidMount() {
        const { searchTerm } = this.state;

        this.fetchSearchTopStories(searchTerm);
    }

    render() {
        const {searchTerm, result} = this.state;
        const page = (result && result.page) || 0;

        console.log(this.state);
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
                    {
                        result ?
                        <Table
                            list={result.hits}
                            onDismiss={this.onDismiss}
                        /> : null
                    }
                    <div className="interactions">
                        <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
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
