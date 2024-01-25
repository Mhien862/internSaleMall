import { Route, Routes } from "react-router-dom";
import UserManagement from "../pages/UserManagement/UserManagement";
import CoursesManagement from "../pages/CourseManagement/CoursesManagement";
import Home from "../pages/Home/Home";

import ContainerPage from "../pages/Container/ContainerPage";
import DetailCourse from "../pages/DetailCourse/DetailCourse";
import { path } from "../utils";

const Page = () => {
  return (
    <Routes>
      <Route element={<ContainerPage />}>
        <Route path={path.HOME} element={<Home />} exact />
        <Route path={path.USER_MANAGEMENT} element={<UserManagement />} />
        <Route path={path.USER_COURSES} element={<CoursesManagement />} />

        <Route path={path.DETAIL_COURSE} element={<DetailCourse />} />
      </Route>
    </Routes>
  );
};

export default Page;
