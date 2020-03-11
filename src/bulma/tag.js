import React from "react";
import PropTypes from "prop-types";

export default class Tag extends React.Component {
  _renderTag(color, label, main) {
    if (!label) {
      return;
    }
    const colorClass = color
      ? ` is-${color}`
      : "";
    const deleteButton = (this.props.onDelete && main)
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
        {label}
        {deleteButton}
      </a>
      : <span className={`tag${colorClass}`}>
        {label}
        {deleteButton}
      </span>;
  }

  render() {
    return <div className="tags has-addons">
      {this._renderTag(this.props.color, this.props.label, true)}
      {this._renderTag(this.props.extraColor, this.props.extra)}
    </div>;
  }
}
Tag.displayName = "Tag";
Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  color: PropTypes.string,
  extra: PropTypes.string,
  extraColor: PropTypes.string,
};
Tag.defaultProps = {
  onDelete: undefined,
  onClick: undefined,
  color: undefined,
  extra: undefined,
  extraColor: undefined,
};
