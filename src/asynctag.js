import React from "react";
import PropTypes from "prop-types";
import Tag from "./bulma/tag";

export default class AsyncTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {label: null};
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.getLabelForValue(this.props.value)
      .then(label => this.setState({label}))
      // eslint-disable-next-line no-console
      .catch(error => console.error(error));
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.value);
    }
  }

  handleDelete() {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.value);
    }
  }

  _getLabel() {
    if (this.state.label !== null) {
      return this.state.label.toString();
    }
    return this.props.value.toString();
  }

  render() {
    const {
      getLabelForValue: _getLabelForValue,
      onDelete,
      onClick,
      value: _value,
      ...otherProps
    } = this.props;
    const deleteHandler = onDelete
      ? this.handleDelete
      : undefined;
    const clickHandler = onClick
      ? this.handleClick
      : undefined;
    return <Tag
      label={this._getLabel()}
      onDelete={deleteHandler}
      onClick={clickHandler}
      {...otherProps}
    />;
  }
}
AsyncTag.displayName = "AsyncTag";
AsyncTag.propTypes = {
  value: PropTypes.any,
  getLabelForValue: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};
AsyncTag.defaultProps = {
  value: undefined,
  onDelete: undefined,
  onClick: undefined,
};
