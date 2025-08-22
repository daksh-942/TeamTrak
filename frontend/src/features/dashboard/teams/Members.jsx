import Member from "./Member";

function Members({ members }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {members.map((member) => (
        <Member key={member._id} member={member} />
      ))}
    </div>
  );
}

export default Members;
