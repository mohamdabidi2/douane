import Sidebar from "../../../shared/sidebar";
import Header from "../../../shared/header";

import ProfileContent from "./profileContent";
const Profile = () => {
    return ( 
        <div className="dashboard-container">
            <div className="sidebar">
                <Sidebar/>
                
            </div>
            <div className="dashboard-content">
                <Header/>
     <ProfileContent/>
     
            </div>
        </div>
     );
}
 
export default Profile;