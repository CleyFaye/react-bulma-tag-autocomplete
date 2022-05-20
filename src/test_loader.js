/* eslint-disable no-magic-numbers */
/* eslint-env browser */
import React from "react";
import ReactDOM from "react-dom";
import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import TagInput from "./taginput.js";

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
    this.state = {fieldList: [3]};
    this.handleChange = changeHandlerMixin(this);
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
