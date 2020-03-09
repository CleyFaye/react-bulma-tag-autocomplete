import React from "react";
import PropTypes from "prop-types";

export default class TagsList extends React.Component {
  render() {
    const labelElem = this.props.label
      ? <span>{this.props.label}</span>
      : undefined;
    return <div className="tags">
      {labelElem}&nbsp;:
      {this.props.children}
    </div>;
  }
}
TagsList.displayName = "TagsList";
TagsList.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};
TagsList.defaultProps = {
  children: undefined,
  label: undefined,
};
