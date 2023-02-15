import { CSidebar, CSidebarNav, CNavItem } from "@coreui/react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const logoutFn = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <CSidebar unfoldable className="vh-100 bg-black  ">
      <CSidebarNav>
        <CNavItem className="bg-secondary d-flex">
          <i className="bi bi-bar-chart-fill text-white mx-3 my-2"></i>
          <h5 className="mx-3 my-2 text-white fw-bolder">side</h5>
        </CNavItem>
      </CSidebarNav>
      <div onClick={logoutFn}>
        <CSidebarNav>
          <CNavItem className="bg-secondary d-flex  ">
            <i className="bi bi-box-arrow-left text-white mx-3 my-3"></i>
            <h6 className="mx-3 my-3 text-white">Log Out</h6>
          </CNavItem>
        </CSidebarNav>
      </div>
    </CSidebar>
  );
}

export default Sidebar;
