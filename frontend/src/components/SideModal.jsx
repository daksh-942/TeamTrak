function SideModal() {
  return (
    <div className="fixed">
      <h1>New Project</h1>
      <div>
        <label htmlFor="projectName">Project Name</label>
        <input type="text" name="projectName" id="projectName" />
      </div>
      <div>
        <button>Create Project</button>
        <button>Back</button>
      </div>
    </div>
  );
}

export default SideModal;
