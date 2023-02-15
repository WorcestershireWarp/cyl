import { Assignment } from "./App";

function gradeArrayAvg(array: Assignment[]) {
  var sum = 0;
  return (
    array.forEach(function (item) {
      sum += item.grade;
    }),
    sum / array.length
  );
}
function solveForTwoWeights(weightA: number, weightB: number) {
  return [
    (1 / (weightA + weightB)) * weightA,
    (1 / (weightA + weightB)) * weightB,
  ];
}
export default function weightedAverage(
  array: Assignment[],
  weights: number[]
) {
  let [a, b, c] = (function (array, weights) {
    return [
      array.filter((i) => i.weight == weights[0]),
      array.filter((i) => i.weight == weights[1]),
      array.filter((i) => i.weight == weights[2]),
    ];
  })(array, weights);
  if (b.length + c.length === 0) {
    return gradeArrayAvg(a);
  }
  if (a.length + c.length === 0) {
    return gradeArrayAvg(b);
  }
  if (b.length + a.length === 0) {
    return gradeArrayAvg(c);
  }
  const bc = solveForTwoWeights(weights[1], weights[2]),
    ac = solveForTwoWeights(weights[0], weights[2]),
    ba = solveForTwoWeights(weights[1], weights[0]);
  return (
    (a =
      0 == a.length
        ? [
            new Assignment(
              "Placeholder; see settings",
              gradeArrayAvg(b) * bc[0] + gradeArrayAvg(c) * bc[1],
              weights[0]
            ),
          ]
        : a),
    (b =
      0 == b.length
        ? [
            new Assignment(
              "Placeholder; see settings",
              gradeArrayAvg(a) * ac[0] + gradeArrayAvg(c) * ac[1],
              weights[1]
            ),
          ]
        : b),
    (c =
      0 == c.length
        ? [
            new Assignment(
              "Placeholder; see settings",
              gradeArrayAvg(b) * ba[0] + gradeArrayAvg(a) * ba[1],
              weights[2]
            ),
          ]
        : c),
    Math.round(
      (gradeArrayAvg(a) * weights[0] +
        gradeArrayAvg(b) * weights[1] +
        gradeArrayAvg(c) * weights[2]) *
        100
    ) / 100
  );
}
