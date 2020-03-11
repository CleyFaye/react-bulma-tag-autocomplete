/* eslint-disable no-magic-numbers */
/* eslint-env browser */
import React from "react";
import ReactDOM from "react-dom";
import TagInput from "./taginput";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";

const possibleValues = [
  "user1",
  "user2",
  "user3",
  "something1",
  "something2",
  "something3",
  "cleyfaye",
  "user3WithSomethingAfter",
];

const getLabelForValue = value => Promise.resolve(possibleValues[value]);

const getCompletion = filterString => {
  if (filterString === "") {
    return [];
  }
  const values = possibleValues.filter(
    v => v.indexOf(filterString) !== -1,
  );
  return values.map(v => possibleValues.indexOf(v));
};

class TagInputTester extends React.Component {
  constructor(props) {
    super(props);
    exState(
      this,
      {fieldList: [3]},
    );
    changeHandler(this);
  }

  render() {
    return <TagInput
      getLabelForValue={getLabelForValue}
      getCompletion={getCompletion}
      name="fieldList"
      value={this.state.fieldList}
      onChange={this.handleChange}
      label="Some test label"
    />;
  }
}
TagInputTester.displayName = "TagInputTester";

ReactDOM.render(
  <TagInputTester />,
  document.getElementById("testId"),
);
