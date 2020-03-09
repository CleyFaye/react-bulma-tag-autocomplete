import React from "react";
import PropTypes from "prop-types";

export default class Tag extends React.Component {
  render() {
    const colorClass = this.props.color
      ? ` is-${this.props.color}`
      : "";
    const deleteButton = this.props.onDelete
      ? <button
        type="button"
        className="delete is-small"
        onClick={this.props.onDelete}
      />
      : undefined;
    return this.props.onClick
      ? <a
        onClick={this.props.onClick}
        className={`tag is-link${colorClass}`}
      >
        {this.props.label}
        {deleteButton}
      </a>
      : <span className={`tag${colorClass}`}>
        {this.props.label}
        {deleteButton}
      </span>;
  }
}
Tag.displayName = "Tag";
Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  color: PropTypes.string,
};
Tag.defaultProps = {
  onDelete: undefined,
  onClick: undefined,
  color: undefined,
};
