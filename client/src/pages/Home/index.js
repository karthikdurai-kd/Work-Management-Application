// Home Component

import { useEffect, useState } from "react";
import { Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getProjectBasedOnUserRoleCall } from "../../apiCalls/projectApiCall";
import { setLoading } from "../../store/loader/loaderReducer";
import ProjectCard from "../../components/ProjectCard";

const Home = () => {
  // Project state
  const [projects, setProjects] = useState([]);

  // "useSelector" hook for getting redux store data
  const { user } = useSelector((state) => {
    return state.users;
  });

  // useDispatch hook
  const dispatch = useDispatch();

  // Fetch project method
  const fetchProject = async () => {
    try {
      dispatch(setLoading(true));
      const fetchProjectResult = await getProjectBasedOnUserRoleCall({
        userID: user._id,
      });
      if (fetchProjectResult.status === "success") {
        setProjects(fetchProjectResult.data); // Saving the projects fetched from backend to "projects" state
        dispatch(setLoading(false));
      } else {
        throw new Error(fetchProjectResult.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect hook
  useEffect(() => {
    fetchProject();
  }, []);

  // UI
  return (
    <div>
      <h1>
        Hello {user?.firstName} {user?.lastName}
      </h1>

      <div className="grid grid-cols-4 gap-5 mt-5">
        {projects.map((project) => (
          <ProjectCard key={project._id} data={project} />
        ))}
      </div>
      {projects.length === 0 && (
        <Result status="404" title="You have no Projects yet" />
      )}
    </div>
  );
};

export default Home;
