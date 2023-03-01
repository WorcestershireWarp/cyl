import { weightedAverage, type Assignment } from "./backend";
import classNames from "classnames";
import React from "react";

export function Averages({
  assignments,
  weights,
}: {
  assignments: Assignment[];
  weights: number[];
}) {
  const realAverage = weightedAverage(
    assignments.filter((assignment) => !assignment.theoretical),
    weights
  );
  const theoreticalAverage = weightedAverage(assignments, weights);
  const showTheoreticalAverage = assignments.some(
    (assignment) => assignment.theoretical
  );
  const theoryAverageClass = classNames("average", {
    "average-failing": theoreticalAverage < 70,
  });
  const realAverageClass = classNames("average", {
    theory: showTheoreticalAverage,
    "average-failing": realAverage < 70,
  });
  const arrow =
    realAverage < theoreticalAverage
      ? "⇧"
      : realAverage > theoreticalAverage
      ? "⇩"
      : "⇨";
  const arrowClass = classNames({
    "arrow-up": realAverage < theoreticalAverage,
    "arrow-down": realAverage > theoreticalAverage,
  });
  return (
    <div className="averages">
      <span>
        Current Average:
        <br />
        <span className={realAverageClass}>
          {realAverage.toLocaleString("en", {
            useGrouping: false,
            minimumFractionDigits: 2,
          })}
        </span>
      </span>
      {showTheoreticalAverage && (
        <span>
          Including Theoretical Assignments: <br />
          <span className={theoryAverageClass}>
            <span className={arrowClass}>{arrow}</span>
            {theoreticalAverage.toLocaleString("en", {
              useGrouping: false,
              minimumFractionDigits: 2,
            })}
          </span>
        </span>
      )}
    </div>
  );
}
