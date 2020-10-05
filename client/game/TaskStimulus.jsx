import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { round, stage, player } = this.props;

    const imagePath = round.get("imagePath");
    const questionText = round.get("questionText");

    return (
      <div className="task-stimulus">
        <div className="task-image">
          {imagePath ? <img src={imagePath} /> : ""}
        </div>
        <div className="task-question">
          <b>Please answer the following question:</b>
          <br />
          <span dangerouslySetInnerHTML={{__html: questionText}} />;
        </div>
      </div>
    );
  }
}
