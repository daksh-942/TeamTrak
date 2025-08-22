import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MileStones from "./MileStones";
import Timeline from "../../../components/Timeline";
import ProjectQuickStats from "./ProjectQuickStats";
import SplashScreen from "../../../components/SplashScreen";
import { useParams } from "react-router";
import { getCurrentProject } from "../../../app/slices/project/projectSlice";
import Members from "./Members";
import ProjectResourcesQuickView from "./ProjectResourcesQuickView";
import Description from "./Description";

export default function Overview() {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { currentProject } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getCurrentProject(projectId));
  }, [dispatch, projectId]);

  if (!currentProject) return <SplashScreen />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <Description currentProject={currentProject} />
          <Members currentProject={currentProject} />
          <ProjectResourcesQuickView files={currentProject.files} />
        </div>

        <div className="w-full lg:w-[300px] space-y-6">
          <Timeline activities={currentProject.activityLogs} />
          <MileStones />
          <ProjectQuickStats />
        </div>
      </div>
    </div>
  );
}
