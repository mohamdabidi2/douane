import Sidebar from "../../../shared/sidebar";
import Header from "../../../shared/header";
import FichiersDossiersContent from "./dossierFichierContent";
const DossiersFichiersDouane = () => {
    return ( 
        <div className="dashboard-container">
            <div className="sidebar">
                <Sidebar/>
                
            </div>
            <div className="dashboard-content">
                <Header/>
     <FichiersDossiersContent/>
     
            </div>
        </div>
     );
}
 
export default DossiersFichiersDouane;