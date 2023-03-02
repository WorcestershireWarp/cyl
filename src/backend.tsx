import { immerable } from "immer";

// Create a class to hold assignment data in a more efficient manner.
export class Assignment {
  public theoretical;
  [immerable] = true;
  constructor(
    public name: string,
    public grade: number,
    public weight: number,
    theoretical?: boolean
  ) {
    this.name = name;
    this.grade = grade;
    this.weight = weight;
    this.theoretical = theoretical ?? false; // If "theoretical" wasn't provided in the constructor, then assume it's false. This makes code easier to read.
  }
}

export class Class {
  [immerable] = true;
  constructor(public name: string, public assignments: Assignment[]) {
    this.name = name;
    this.assignments = assignments;
  }
}

// Average the "grade" field of each assignment in an array
function gradeArrayAvg(array: Assignment[]) {
  let sum = 0;
  for (const item of array) {
    sum += item.grade;
  }
  return sum / array.length;
}

// If two weights combined don't equal 1, scale them proportionally so they do.
function solveForTwoWeights(weightA: number, weightB: number) {
  return [
    (1 / (weightA + weightB)) * weightA,
    (1 / (weightA + weightB)) * weightB,
  ];
}

function seperateArrayByWeights(array: Assignment[], weights: number[]) {
  return [
    array.filter((index) => index.weight === weights[0]),
    array.filter((index) => index.weight === weights[1]),
    array.filter((index) => index.weight === weights[2]),
  ];
}

// Get a weighted average of assignments with three different weight amounts
export function weightedAverage(array: Assignment[], weights: number[]) {
  // Seperate array to be averaged seperately.
  let [a, b, c] = seperateArrayByWeights(array, weights);
  // If all assignments have the same weight, return the average of the array.
  if (b.length + c.length === 0) {
    return gradeArrayAvg(a);
  }
  if (a.length + c.length === 0) {
    return gradeArrayAvg(b);
  }
  if (b.length + a.length === 0) {
    return gradeArrayAvg(c);
  }
  // If there are assignments for two weights, but not three, then the other two weights are scaled propertionally to equal one.
  // This code checks if any array is empty, and if so, add a placeholder assignment that won't effect the average.
  const bc = solveForTwoWeights(weights[1], weights[2]);
  const ac = solveForTwoWeights(weights[0], weights[2]);
  const ba = solveForTwoWeights(weights[1], weights[0]);
  const placeholderText = "Placeholder; see settings";
  if (a.length === 0) {
    a = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(b) * bc[0] + gradeArrayAvg(c) * bc[1],
        weights[0]
      ),
    ];
  }
  if (b.length === 0) {
    b = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(a) * ac[0] + gradeArrayAvg(c) * ac[1],
        weights[1]
      ),
    ];
  }
  if (c.length === 0) {
    c = [
      new Assignment(
        placeholderText,
        gradeArrayAvg(b) * ba[0] + gradeArrayAvg(a) * ba[1],
        weights[2]
      ),
    ];
  }
  return (
    // Finally, return a weighted average.
    Math.round(
      (gradeArrayAvg(a) * weights[0] +
        gradeArrayAvg(b) * weights[1] +
        gradeArrayAvg(c) * weights[2]) *
        100
    ) / 100
  );
}
