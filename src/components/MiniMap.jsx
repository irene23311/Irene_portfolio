/* eslint-disable react/prop-types */
function MiniMap({ zoomLevel, panOffset, onReset }) {
  try {
    return (
      <div className="fixed bottom-4 right-4 z-40" data-name="mini-map" data-file="components/MiniMap.js">
        <div className="bg-white rounded-lg shadow-lg p-3 mb-2">
          <div className="w-24 h-16 bg-[var(--secondary-color)] rounded border relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="bg-[var(--primary-color)] rounded opacity-50"
                style={{
                  width: Math.max(4, 20 / zoomLevel) + 'px',
                  height: Math.max(3, 12 / zoomLevel) + 'px',
                  transform: `translate(${-panOffset.x / 10}px, ${-panOffset.y / 10}px)`
                }}
              ></div>
            </div>
            <div className="absolute top-1 left-1">
              <div className="w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
            </div>
            <div className="absolute top-2 right-2">
              <div className="w-1 h-1 bg-[var(--primary-color)] rounded-full"></div>
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div className="text-xs text-center mt-1 text-[var(--text-secondary)]">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
        
        <button 
          onClick={onReset}
          className="btn btn-secondary w-full text-sm"
        >
          <div className="icon-home text-sm mr-2"></div>
          Reset View
        </button>
      </div>
    );
  } catch (error) {
    console.error('MiniMap component error:', error);
    return null;
  }
}