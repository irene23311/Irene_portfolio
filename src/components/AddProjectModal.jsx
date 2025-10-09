/* eslint-disable react/prop-types */
function AddProjectModal({ show, onClose, onSave }) {
  try {
    const [formData, setFormData] = React.useState({
      title: '',
      year: new Date().getFullYear(),
      category: 'Web',
      tags: '',
      description: '',
      heroImage: '',
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 150
    });
    const [saving, setSaving] = React.useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      
      try {
        await trickleCreateObject('project', {
          ...formData,
          status: 'active'
        });
        onSave();
        onClose();
        setFormData({
          title: '',
          year: new Date().getFullYear(),
          category: 'Web',
          tags: '',
          description: '',
          heroImage: '',
          x: Math.random() * 600 + 100,
          y: Math.random() * 400 + 150
        });
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        setSaving(false);
      }
    };

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-name="add-project-modal" data-file="components/AddProjectModal.js">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Project</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <div className="icon-x text-lg"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Web">Web</option>
                  <option value="Installations">Installations</option>
                  <option value="Motion">Motion</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary w-full">
              {saving ? 'Saving...' : 'Add Project'}
            </button>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AddProjectModal component error:', error);
    return null;
  }
}