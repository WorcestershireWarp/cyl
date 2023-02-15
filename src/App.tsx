import { ChangeEvent, useState } from "react";
import "./App.css";

class Assignment {
  constructor(
    public name?: string,
    public grade?: number,
    public weight?: number
  ) {
    this.name = name ?? "";
    this.grade = grade ?? 0;
    this.weight = weight ?? 0;
  }
}
function weightedAverage(assignments: Assignment[], weights: number[]) {/*TODO*/}

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    new Assignment("Essay", 94, 0.25),
  ]);
  const onModifyName = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...assignments];
    temp[index].name = event.target.value;
    setAssignments(temp);
  };

  const onModifyGrade = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    if (Number(event.target.value) < 0) {
      return;
    }

    const temp = [...assignments];
    temp[index].grade = Number(event.target.value);
    setAssignments(temp);
  };
  const onModifyWeight = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    if (Number(event.target.value) > 1 || Number(event.target.value) < 0) {
      return;
    }
    const temp = [...assignments];
    temp[index].weight = Number(event.target.value);
    setAssignments(temp);
  };

  const assignmentList = assignments.map((assignment, index) => (
    <tr key={index}>
      <td>
        <button>Delete</button>
      </td>
      <td>
        <input
          value={assignment.name}
          onChange={(event) => {
            onModifyName(event, index);
          }}
        />
      </td>
      <td>
        <input
          value={assignment.grade}
          onChange={(event) => {
            onModifyGrade(event, index);
          }}
          type="number"
        />
      </td>
      <td>
        <input
          value={assignment.weight}
          type="number"
          onChange={(event) => {
            onModifyWeight(event, index);
          }}
        />
      </td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
  ));
  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th />
            <th>Assignment</th>
            <th>Grade</th>
            <th>Weight</th> 
	    <th>Theoretical?</th>
          </tr>
        </thead>{" "}
        <tbody>
          {assignmentList}
          <tr>
            <td style={{ fontWeight: 500, color: "#000" }}>
              <button disabled>Add assignment</button>{" "}
            </td>
            <td>
              <input />
            </td>
            <td>
              <input />
            </td>
            <td>
              <input />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
