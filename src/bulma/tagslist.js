import React from "react";
import PropTypes from "prop-types";

export default class TagsList extends React.Component {
  _renderChildrens() {
    if (!this.props.children) {
      return;
    }
    return React.Children.map(
      this.props.children,
      child => {
        if (!child) {
          return;
        }
        return <div className="control">
          {child}
        </div>;
      },
    );
  }

  render() {
    const labelElem = this.props.label
      ? <span>{this.props.label}</span>
      : undefined;
    return <>
      <span className="is-size-7 has-text-weight-semibold">
        {labelElem}
      </span>
      <div className="field is-grouped is-grouped-multiline">
        {this._renderChildrens()}
      </div>
    </>;
  }
}
TagsList.displayName = "TagsList";
TagsList.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
};
TagsList.defaultProps = {
  children: undefined,
  label: undefined,
};
