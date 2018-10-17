// @flow
/* global document */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';

import PluginEditList from '../lib';

import INITIAL_VALUE from './value';

const plugin = PluginEditList();
const plugins = [plugin];

function renderNode(props: *) {
    const { node, attributes, children, editor } = props;
    const isCurrentItem = plugin.utils
        .getItemsAtRange(editor.value)
        .contains(node);

    switch (node.type) {
        case 'ul_list':
            return <ul {...attributes}>{children}</ul>;
        case 'ol_list':
            return <ol {...attributes}>{children}</ol>;

        case 'list_item':
            return (
                <li
                    className={isCurrentItem ? 'current-item' : ''}
                    title={isCurrentItem ? 'Current Item' : ''}
                    {...props.attributes}
                >
                    {props.children}
                </li>
            );

        case 'paragraph':
            return <p {...attributes}>{children}</p>;
        case 'heading':
            return <h1 {...attributes}>{children}</h1>;
        default:
            return <p {...attributes}>{children}</p>;
    }
}

class Example extends React.Component<*, *> {
    editor: React.Node<typeof Editor>;

    state = {
        value: INITIAL_VALUE
    };

    ref = (editor: ?React.Node<typeof Editor>) => {
        if (editor) {
            this.editor = editor;
        }
    };

    renderToolbar() {
        const {
            wrapInList,
            unwrapList,
            increaseItemDepth,
            decreaseItemDepth
        } = plugin.changes;
        const inList = plugin.utils.isSelectionInList(this.state.value);

        return (
            <div>
                <button
                    className={inList ? 'active' : ''}
                    onClick={() => this.call(inList ? unwrapList : wrapInList)}
                >
                    <i className="fa fa-list-ul fa-lg" />
                </button>

                <button
                    className={inList ? '' : 'disabled'}
                    onClick={() => this.call(decreaseItemDepth)}
                >
                    <i className="fa fa-outdent fa-lg" />
                </button>

                <button
                    className={inList ? '' : 'disabled'}
                    onClick={() => this.call(increaseItemDepth)}
                >
                    <i className="fa fa-indent fa-lg" />
                </button>

                <span className="sep">·</span>

                <button onClick={() => this.call(wrapInList)}>
                    Wrap in list
                </button>
                <button onClick={() => this.call(unwrapList)}>
                    Unwrap from list
                </button>
            </div>
        );
    }

    call(change) {
        return this.editor.change(change);
    }

    onChange = ({ value }) => {
        this.setState({
            value
        });
    };

    render() {
        return (
            <div>
                {this.renderToolbar()}
                <Editor
                    ref={this.ref}
                    placeholder="Enter some text..."
                    plugins={plugins}
                    value={this.state.value}
                    onChange={this.onChange}
                    renderNode={renderNode}
                    shouldNodeComponentUpdate={props =>
                        // To update the highlighting of nodes inside the selection
                        props.node.type === 'list_item'
                    }
                />
            </div>
        );
    }
}

// $FlowFixMe
ReactDOM.render(<Example />, document.getElementById('example'));
