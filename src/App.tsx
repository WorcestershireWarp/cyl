import { useState } from 'react'
import './App.css'

class Assignment {
	constructor(public name?: string, public grade?: number, public weight?: number) {
	this.name = name ?? ""
	this.grade = grade ?? 0
	this.weight = weight ?? 0
	}
}

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([new Assignment('lol', 50, 0.25)]);
  const assignmentList = assignments.map(assignment => <tr><td><button>Delete</button></td><td><input value={assignment.name}></input></td><td><input value={assignment.grade}></input></td><td><input value={assignment.weight}></input></td></tr>)
  return (
    <div className="App">
	<table>
		<tr><th/><th>Assignment</th><th>Grade</th><th>Weight</th></tr>
	{assignmentList}
		<tr><td style={{fontWeight: 500, color: '#000'}}>Create new assignment: </td><td><input/></td><td><input/></td><td><input/></td></tr>
	</table>
    </div>
  )
}

export default App
