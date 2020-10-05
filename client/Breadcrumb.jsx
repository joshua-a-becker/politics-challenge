import React from "react";

import { Breadcrumb as Crumb, Classes } from "@blueprintjs/core";

export default class Breadcrumb extends React.Component {
  render() {
    const { game, round, stage } = this.props;

    return (
      <nav className="round-nav">
        <ul className={Classes.BREADCRUMBS}>
          <li>
            <Crumb text={`Question ${round.index + 1} of ${game.get("numRounds")}`} />
          </li>
          {round.stages.map(s => {
            const disabled = s.name !== stage.name;
            const current = disabled ? "" : Classes.BREADCRUMB_CURRENT;
            return (
              <li key={s.name}>
                <Crumb
                  text={s.displayName}
                  disabled={disabled}
                  className={current}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
