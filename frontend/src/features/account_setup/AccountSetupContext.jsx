import { createContext, useContext, useState } from "react";

const AccountSetupContext = createContext();

// eslint-disable-next-line react/prop-types
export function AccountSetupProvider({ children }) {
  const [step, setStep] = useState(1);
  const [projectName,setProjectName]=useState("project-name");
  const [TaskName,setTaskName]=useState("Task name");
  return (
    <AccountSetupContext.Provider value={{ setStep, step,setProjectName,projectName,TaskName,setTaskName}}>
      {children}
    </AccountSetupContext.Provider>
  );
}

export function useAccountSetup() {
  const context = useContext(AccountSetupContext);
  if (!context) console.log("Account setup is used outside provider");
  return context;
}

// start step - continue with a project
// first project setup step - project title
// task specification step
// invite the teammate
