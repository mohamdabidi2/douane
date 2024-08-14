import Sidebar from "../../../shared/sidebar";
import Header from "../../../shared/header";
import CreationDossierContent from "./creationDossierContent";

const AjouterDossier = () => {
    return ( 
        <div className="dashboard-container">
            <div className="sidebar">
                <Sidebar/>
                
            </div>
            <div className="dashboard-content">
                <Header/>
   <CreationDossierContent/>
     
            </div>
        </div>
     );
}
 
export default AjouterDossier;