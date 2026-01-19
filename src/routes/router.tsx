import { createBrowserRouter } from 'react-router-dom';
import GPACalculator from '../Pages/GPACalculator';
import StudyMaterials from '../Pages/StudyMaterials';
const router =createBrowserRouter(
    [
        {path: "/",element: <GPACalculator />},
        {path: "/study-material",element: <StudyMaterials/> },

    ]
)
export default router