import React, {Component} from "react";
import {Button, SORTS} from "./List";

const largeColumn = {
    width: '40%',
};

const midColumn = {
    width: '30%',
};

const smallColumn = {
    width: '10%',
};

class Table extends Component {
    render() {
        const {
            list,
            onDismiss,
            sortKey,
            onSort,
            isSortReverse,
        } = this.props;

        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;

        return (
            <div className="table">
                <div className="table-header">
                    <span style={{ width: '40%' }}>
                        <Sort
                            sortKey={'TITLE'}
                            onSort={onSort}
                            activeSortKey={sortKey}
                        > Title
                        </Sort>
                    </span>
                    <span style={{ width: '30%' }}>
                        <Sort
                            sortKey={'AUTHOR'}
                            onSort={onSort}
                            activeSortKey={sortKey}
                        >
                            Author
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort
                            sortKey={'COMMENTS'}
                            onSort={onSort}
                            activeSortKey={sortKey}
                        >
                          Comments
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        <Sort
                            sortKey={'POINTS'}
                            onSort={onSort}
                            activeSortKey={sortKey}
                        > Points
                        </Sort>
                    </span>
                    <span style={{ width: '10%' }}>
                        Archive
                    </span>
                    </div>
                {reverseSortedList.map(item =>
                    <div key={item.objectID} className="table-row">
                        <span style={largeColumn}>
                            <a href={item.url}>{item.title}</a>
                        </span>
                        <span style={midColumn}>{item.author}</span>
                        <span style={smallColumn}>{item.num_comments}</span>
                        <span style={smallColumn}>{item.points}</span>
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

const Sort = ({
    sortKey,
    onSort,
    children,
    activeSortKey
    }) => {
    const sortClass = ['button-inline'];
    if (sortKey === activeSortKey) {
        sortClass.push('button-active');
    }

    return(
        <Button
            onClick={() => onSort(sortKey)}
            className={sortClass.join(' ')}
        >
            {children}
        </Button>
    );
};

export default Table;
