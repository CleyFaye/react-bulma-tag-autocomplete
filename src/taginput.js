import React from "react";
import PropTypes from "prop-types";
import asyncTriggerMixin from "@cley_faye/react-utils/lib/mixin/asynctrigger.js";
import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import TagsList from "./bulma/tagslist.js";
import AsyncTag from "./asynctag.js";

export default class TagInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterString: "",
      filterList: [],
      error: null,
      selection: 0,
      nameCache: {},
    };
    this.handleChange = changeHandlerMixin(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this._callGetLabelForValue = this._callGetLabelForValue.bind(this);
    const REFRESH_DELAY = 700;
    this.refreshFilterTrigger = asyncTriggerMixin(
      this,
      this.asyncTriggerRefreshFilter.bind(this),
      REFRESH_DELAY,
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filterString !== this.state.filterString) {
      this.refreshFilterTrigger.trigger();
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

  handleKeyDown(ev) {
    if (ev.key === "Enter") {
      const filteredList = this._filteredResultsList();
      if (
        filteredList.length > 0
        && this.state.selection < filteredList.length
      ) {
        const selection = this.state.selection;
        if (filteredList.length === 1) {
          this.setState({filterString: ""});
        }
        this.setState({selection: Math.max(0, selection - 1)});
        this.handleAdd(filteredList[selection]);
      }
    }
    if (
      [
        "ArrowDown",
        "Down",
      ].includes(ev.key)
    ) {
      ev.preventDefault();
      this.setState(oldState => {
        let selection = oldState.selection + 1;
        const filteredList = this._filteredResultsList();
        if (selection >= filteredList.length) {
          selection = 0;
        }
        return {selection};
      });
    }
    if (
      [
        "ArrowUp",
        "Up",
      ].includes(ev.key)
    ) {
      ev.preventDefault();
      this.setState(oldState => {
        let selection = oldState.selection - 1;
        if (selection < 0) {
          const filteredList = this._filteredResultsList();
          selection = filteredList.length - 1;
        }
        return {selection};
      });
    }
  }

  _checkUpdateSelection(value, label) {
    if (label === this.state.filterString) {
      const filteredList = this._filteredResultsList();
      this.setState({selection: filteredList.indexOf(value)});
    }
  }

  _callGetLabelForValue(value) {
    if (this.state.nameCache[value] !== undefined) {
      const label = this.state.nameCache[value];
      this._checkUpdateSelection(value, label);
      return Promise.resolve(this.state.nameCache[value]);
    }
    let retrievedLabel;
    return Promise.resolve()
      .then(() => this.props.getLabelForValue(value))
      .then(label => this.setState(oldState => {
        const nameCache = {...oldState.nameCache};
        nameCache[value] = label;
        retrievedLabel = label;
        return {nameCache};
      }))
      .then(() => {
        this._checkUpdateSelection(value, retrievedLabel);
        return retrievedLabel;
      });
  }

  _callGetCompletion() {
    return Promise.resolve()
      .then(() => this.props.getCompletion(this.state.filterString));
  }

  asyncTriggerRefreshFilter() {
    this._callGetCompletion(this.state.filterString)
      .then(filterList => this.setState({
        filterList,
        selection: 0,
      }))
      .catch(error => this.setState({error}));
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
      return [];
    }
    return this.props.value.map(
      value => <AsyncTag
        key={value}
        value={value}
        color="success"
        getLabelForValue={this._callGetLabelForValue}
        onDelete={this.handleDelete}
      />,
    );
  }

  _renderFilterTags() {
    const filteredResults = this._filteredResultsList();
    if (filteredResults.length === 0) {
      return [];
    }
    return this._filteredResultsList().map(
      (value, id) => <AsyncTag
        key={value}
        value={value}
        extra={id === this.state.selection ? "+" : undefined}
        color={id === this.state.selection ? "warning" : "primary"}
        getLabelForValue={this._callGetLabelForValue}
        onClick={this.handleAdd}
      />,
    );
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
          type="search"
          name="filterString"
          value={this.state.filterString}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          onKeyDown={this.handleKeyDown}
          autoComplete="off"
        />
      </div>
      <TagsList label={this.props.tagsLabel}>
        {[
          ...this._renderActiveTags(),
          ...this._renderFilterTags(),
        ]}
      </TagsList>
    </div>;
  }
}
TagInput.displayName = "TagInput";
TagInput.propTypes = {
  label: PropTypes.node,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
  name: PropTypes.string,
  getLabelForValue: PropTypes.func.isRequired,
  getCompletion: PropTypes.func.isRequired,
  tagsLabel: PropTypes.node,
};
TagInput.defaultProps = {
  label: undefined,
  placeholder: undefined,
  value: undefined,
  onChange: undefined,
  name: undefined,
  tagsLabel: "Active",
};
