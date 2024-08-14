

import Header from "../../shared/header";
import Sidebar from "../../shared/sidebar";
import UserManagement from "./userpage";
const Users = () => {
    return ( 
        <div className="dashboard-container">
            <div className="sidebar">
                <Sidebar/>
                
            </div>
            <div className="dashboard-content">
                <Header/>
             <UserManagement/>
     
            </div>
        </div>
     );
}
 
export default Users;