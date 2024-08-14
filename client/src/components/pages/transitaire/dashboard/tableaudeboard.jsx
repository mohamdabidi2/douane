import Sidebar from "../../../shared/sidebar";
import TraitementAvecTemps from "../../../shared/TraitementAvecTemps";
import "./tableaudeboard.css"
import StatistiquesDossiers from '../../../shared/DossierParEtat';
import PaysStat from "../../../shared/PaysStat";
import Header from "../../../shared/header";
const DashboardDouane = () => {
    return ( 
        <div className="dashboard-container">
            <div className="sidebar">
                <Sidebar/>
                
            </div>
            <div className="dashboard-content">
                <Header/>
            <TraitementAvecTemps/>
           <div className="chart-part2">
           <StatistiquesDossiers/>
           <PaysStat/>
           </div>
            </div>
        </div>
     );
}
 
export default DashboardDouane;