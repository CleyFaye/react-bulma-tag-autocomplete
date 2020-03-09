import React from "react";
import PropTypes from "prop-types";
import TagsList from "./bulma/tagslist";
import AsyncTag from "./asynctag";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";

export default class TagInput extends React.Component {
  constructor(props) {
    super(props);
    exState(
      this,
      {
        filterString: "",
        filterList: [],
        error: null,
        nameCache: {},
      },
    );
    changeHandler(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this._callGetLabelForValue = this._callGetLabelForValue.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filterString !== this.state.filterString) {
      this._refreshFilter();
    }
  }

  handleAdd(valueToAddSrc) {
    const valueToAdd = Number(valueToAddSrc);
    if (this.props.value.includes(valueToAdd)) {
      return;
    }
    const newValue = this.props.value.slice();
    newValue.push(valueToAdd);
    this._callChange(newValue);
  }

  handleDelete(valueToRemove) {
    if (!this.props.value.includes(valueToRemove)) {
      return;
    }
    const newValue = this.props.value.filter(
      v => v !== valueToRemove,
    );
    this._callChange(newValue);
  }

  handleKeyUp(ev) {
    const RETURN = 13;
    if (ev.keyCode === RETURN) {
      const filteredList = this._filteredResultsList();
      if (filteredList.length === 1) {
        this.updateState({filterString: ""});
        this.handleAdd(filteredList[0]);
        return;
      }
      if (
        Object.values(this.state.nameCache).includes(this.state.filterString)
      ) {
        for (const key in this.state.nameCache) {
          if (this.state.nameCache[key] === this.state.filterString) {
            this.updateState({filterString: ""});
            this.handleAdd(key);
            return;
          }
        }
      }
    }
  }

  _callGetLabelForValue(value) {
    if (this.state.nameCache[value] !== undefined) {
      return Promise.resolve(this.state.nameCache[value]);
    }
    let retrievedLabel;
    return Promise.resolve()
      .then(() => this.props.getLabelForValue(value))
      .then(label => this.updateState(oldState => {
        const nameCache = {...oldState.nameCache};
        nameCache[value] = label;
        retrievedLabel = label;
        return {nameCache};
      }))
      .then(() => retrievedLabel);
  }

  _callGetCompletion() {
    return Promise.resolve()
      .then(() => this.props.getCompletion(this.state.filterString));
  }

  _refreshFilter() {
    // Trigger using delayed async
    this._callGetCompletion(this.state.filterString)
      .then(filterList => this.updateState({filterList}))
      .catch(error => this.updateState({error}));
  }

  _filteredResultsList() {
    return this.state.filterList.filter(
      filterValue => !this.props.value.includes(filterValue),
    );
  }

  _callChange(newValue) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange({
      target: {
        name: this.props.name,
        value: newValue,
      },
    });
  }

  _renderActiveTags() {
    if (this.props.value.length === 0) {
      return;
    }
    return <TagsList
      label={this.props.enabledLabel}
    >
      {this.props.value.map(
        value => <AsyncTag
          key={value}
          value={value}
          color="success"
          getLabelForValue={this._callGetLabelForValue}
          onDelete={this.handleDelete}
        />,
      )}
    </TagsList>;
  }

  _renderFilterTags() {
    const filteredResults = this._filteredResultsList();
    if (filteredResults.length === 0) {
      return;
    }
    return <TagsList
      label={this.props.filterLabel}
    >
      {this._filteredResultsList().map(
        value => <AsyncTag
          key={value}
          value={value}
          color="primary"
          getLabelForValue={this._callGetLabelForValue}
          onClick={this.handleAdd}
        />,
      )}
    </TagsList>;
  }

  render() {
    if (this.state.error) {
      return <span>An error occured: {this.state.error}</span>;
    }
    const labelElem = this.props.label
      ? <label className="label">{this.props.label}</label>
      : undefined;
    return <div className="field">
      {labelElem}
      <div className="control is-expanded">
        <input
          className="input"
          type="text"
          name="filterString"
          value={this.state.filterString}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          onKeyUp={this.handleKeyUp}
          autoComplete="off"
        />
      </div>
      {this._renderActiveTags()}
      {this._renderFilterTags()}
    </div>;
  }
}
TagInput.displayName = "TagInput";
TagInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
  name: PropTypes.string,
  getLabelForValue: PropTypes.func.isRequired,
  getCompletion: PropTypes.func.isRequired,
  enabledLabel: PropTypes.string,
  filterLabel: PropTypes.string,
};
TagInput.defaultProps = {
  label: undefined,
  placeholder: undefined,
  value: undefined,
  onChange: undefined,
  name: undefined,
  enabledLabel: "Active",
  filterLabel: "Add",
};
