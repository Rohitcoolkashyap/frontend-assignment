import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const projectsPerPage = 5;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json');
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(projects.length / projectsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="app-container" role="main">
      <h1>Projects</h1>
      
      {loading ? (
        <div className="loading" role="status" aria-live="polite">Loading...</div>
      ) : (
        <>
          <div className="table-container">
            <table role="table" aria-label="Projects data">
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Percentage funded</th>
                  <th scope="col">Amount pledged</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project, index) => (
                  <tr key={indexOfFirstProject + index}>
                    <td role="cell">{indexOfFirstProject + index + 1}</td>
                    <td role="cell">{project['percentage.funded']}</td>
                    <td role="cell">{project['amt.pledged'].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav className="pagination" role="navigation" aria-label="Pagination">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-nav"
              aria-label="Go to previous page"
            >
              Prev
            </button>
            <span className="current-page" aria-current="page">
              Page {currentPage} of {Math.ceil(projects.length / projectsPerPage)}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}
              className="pagination-nav"
              aria-label="Go to next page"
            >
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  )
}

export default App