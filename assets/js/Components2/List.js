import React, {Component} from "react";
import { sortBy } from 'lodash';
import Table from "./Table";
import Search from "./Search";

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};

class List extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
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

        function isNotEmpty(hit) {
            return hit.title !== "" && hit.title !== null;
        }

        const notEmptyHits = hits.filter(isNotEmpty);

        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        const updatedHits = [
            ...oldHits,
            ...notEmptyHits
        ];

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            },
            isLoading: false
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        this.setState({ isLoading: true });

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
        const {
            searchTerm,
            results,
            searchKey,
            error,
            isLoading,
        } = this.state;

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
                        <ButtonWithLoading
                            isLoading={isLoading}
                            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
                        >
                            More
                        </ButtonWithLoading>
                    </div>
                </div>
            </div>
        );
    }
}

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

const Loading = () =>
    <div>Loading ...</div>;

const withLoading = (Component) => ({ isLoading, ...rest }) =>
    isLoading
        ? <Loading />
        : <Component { ...rest } />;

const ButtonWithLoading = withLoading(Button);

export default List;

export {
    Button,
    SORTS
};
