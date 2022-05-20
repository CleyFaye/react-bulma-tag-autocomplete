import React from "react";
import PropTypes from "prop-types";

export default class Tag extends React.Component {
  renderDeleteButton(main) {
    if (this.props.onDelete && main) {
      return <button
        type="button"
        className="delete is-small"
        onClick={this.props.onDelete}
      />;
    }
  }

  _renderTag(color, label, main) {
    if (!label) {
      return;
    }
    const colorClass = color
      ? ` is-${color}`
      : "";
    const deleteButton = this.renderDeleteButton(main);
    if (this.props.onClick) {
      return <a
        onClick={this.props.onClick}
        className={`tag is-link${colorClass}`}
      >
        {label}
        {deleteButton}
      </a>;
    }

    return <span className={`tag${colorClass}`}>
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
  label: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  color: PropTypes.string,
  extra: PropTypes.node,
  extraColor: PropTypes.string,
};
Tag.defaultProps = {
  onDelete: undefined,
  onClick: undefined,
  color: undefined,
  extra: undefined,
  extraColor: undefined,
};
