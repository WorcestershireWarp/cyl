import { Assignment } from "./App";

function gradeArrayAvg(array: Assignment[]) {
  let sum = 0;
  for (const item of array) {
    sum += item.grade;
  }
  return sum / array.length;
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
  let [a, b, c] = seperateArrayByWeights(array, weights);
  if (b.length + c.length === 0) {
    return gradeArrayAvg(a);
  }
  if (a.length + c.length === 0) {
    return gradeArrayAvg(b);
  }
  if (b.length + a.length === 0) {
    return gradeArrayAvg(c);
  }
  const bc = solveForTwoWeights(weights[1], weights[2]);
  const ac = solveForTwoWeights(weights[0], weights[2]);
  const ba = solveForTwoWeights(weights[1], weights[0]);
  const placeholderText = "Placeholder; see settings";
  return (
    (a =
      a.length === 0
        ? [
            new Assignment(
              placeholderText,
              gradeArrayAvg(b) * bc[0] + gradeArrayAvg(c) * bc[1],
              weights[0]
            ),
          ]
        : a),
    (b =
      b.length === 0
        ? [
            new Assignment(
              placeholderText,
              gradeArrayAvg(a) * ac[0] + gradeArrayAvg(c) * ac[1],
              weights[1]
            ),
          ]
        : b),
    (c =
      c.length === 0
        ? [
            new Assignment(
              placeholderText,
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
function seperateArrayByWeights(array: Assignment[], weights: number[]) {
  return [
    array.filter((index) => index.weight === weights[0]),
    array.filter((index) => index.weight === weights[1]),
    array.filter((index) => index.weight === weights[2]),
  ];
}
