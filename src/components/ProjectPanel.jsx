/* eslint-disable react/prop-types */
function ProjectPanel({ project, onClose, onRefresh }) {
  try {
    if (!project) return null;

    const handleEdit = (project) => {
      // TODO: Implement edit modal
      console.log('Edit project:', project.id);
    };

    const handleDelete = async (project) => {
      if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
        try {
          await trickleDeleteObject('project', project.id);
          onRefresh();
          onClose();
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      }
    };
    {/* likely uses this to animate the panel sliding in/out. */}
    return (
      <div className={`panel-slide ${project ? 'open' : ''} fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto`} data-name="project-panel" data-file="components/ProjectPanel.js">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{project.title}</h2>
            {/*close button*/}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close panel"
            >
              <div className="icon-x text-lg text-[var(--text-secondary)]"></div>
            </button>
          </div>

          {/*size of hero image*/}
          <div className="mb-6">
            <img 
              src={project.heroImage} 
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/*Meta block (year, category, tags)*/}
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm text-[var(--text-secondary)]">{project.year}</span>
              <span className="text-sm bg-[var(--secondary-color)] px-2 py-1 rounded">{project.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          </div>
          {/*Project Description*/}
          <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="space-y-3">
            <button className="btn btn-primary w-full">
              <div className="icon-external-link text-lg mr-2"></div>
              Open Case Study
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleEdit(project)}
                className="btn btn-secondary text-sm"
              >
                <div className="icon-edit text-sm mr-2"></div>
                Edit
              </button>
              <button 
                onClick={() => handleDelete(project)}
                className="btn text-sm bg-red-100 text-red-700 hover:bg-red-200"
              >
                <div className="icon-trash text-sm mr-2"></div>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProjectPanel component error:', error);
    return null;
  }
}
export default ProjectPanel;