import { useNavigate } from "react-router";
import { useAccountSetup } from "./AccountSetupContext";
import GetStarted from "./GetStarted";
import ProjectSetup from "./ProjectSetup";
import TaskSetup from "./TaskSetup";
import TeamInvite from "./TeamInvite";

function AccountSetup() {
  const { step } = useAccountSetup();
  const navigate = useNavigate();
  switch (step) {
    case 1:
      return <GetStarted />;
    case 2:
      return <ProjectSetup />;
    case 3:
      return <TaskSetup />;
    case 4:
      return <TeamInvite/>
    default:
      return null;
  }
}

export default AccountSetup;
