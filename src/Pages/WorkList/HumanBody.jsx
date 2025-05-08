import React, { useState, useRef } from 'react';
import { Layers, ZoomIn,  RotateCw, Eye, EyeOff, Maximize2, Minimize2, Heart, Activity } from 'lucide-react';

const ZygoteBodyViewer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSystem, setActiveSystem] = useState('full');
  const [showControls, setShowControls] = useState(true);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const systemUrls = {
    full: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=1,1,10000',
    skeletal: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
    muscular: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0',
    cardiovascular: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0',
    nervous: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0',
    digestive: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0',
    respiratory: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0',
    skin: 'https://www.zygotebody.com/#nav=1.37,87.59,206.25,0,0,0,0&sel=p:;h:;s:;c:0;o:0&layers=1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'
  };

  const systemDescriptions = {
    full: "Complete anatomical view with all body systems visible.",
    skeletal: "The skeletal system provides structure, support, and protection for the body's tissues and organs. It consists of 206 bones that work with muscles to facilitate movement.",
    muscular: "The muscular system consists of over 600 muscles that enable movement, maintain posture, and generate heat. These muscles work with the skeleton to facilitate all types of body movement.",
    cardiovascular: "The cardiovascular system includes the heart and blood vessels that transport nutrients, oxygen, hormones, and waste products throughout the body.",
    nervous: "The nervous system is the body's main control network, consisting of the brain, spinal cord, and nerves. It processes sensory information and controls bodily functions.",
    digestive: "The digestive system processes food into nutrients that can be absorbed and used by the body. It includes organs such as the stomach, intestines, liver, and pancreas.",
    respiratory: "The respiratory system facilitates gas exchange, bringing oxygen into the body and removing carbon dioxide. Key components include the lungs, trachea, and diaphragm.",
    skin: "The integumentary system includes the skin, hair, and nails. It provides a protective barrier, regulates body temperature, and contains sensory receptors."
  };

  const changeSystem = (system) => {
    setActiveSystem(system);
    setIsLoading(true);
    
    if (iframeRef.current) {
      iframeRef.current.src = systemUrls[system];
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const SystemIcon = ({ system }) => {
    switch(system) {
      case 'full':
        return <Layers className="w-4 h-4" />;
      case 'skeletal':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3Z" />
            <path d="M19 5H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
            <path d="M12 11v8" />
            <path d="m8 15-2 4" />
            <path d="m16 15 2 4" />
          </svg>
        );
      case 'muscular':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 5a4 4 0 0 1 4 4" />
            <path d="M7 9a4 4 0 0 1-4 4" />
            <path d="M17 5a4 4 0 0 0-4 4" />
            <path d="M17 9a4 4 0 0 0 4 4" />
            <path d="M12 9h.01" />
            <path d="M12 13a8 8 0 0 0 8 4" />
            <path d="M12 13a8 8 0 0 1-8 4" />
          </svg>
        );
      case 'cardiovascular':
        return <Heart className="w-4 h-4" />;
      case 'nervous':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15.5 3.5C13.57 3.5 12 5.07 12 7c0-1.93-1.57-3.5-3.5-3.5S5 5.07 5 7c0 4 7 4 7 13 0-9 7-9 7-13 0-1.93-1.57-3.5-3.5-3.5Z" />
          </svg>
        );
      case 'digestive':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 10c-1.5 0-3-.5-3-2s1.5-2 3-2 3 .5 3 2-1.5 2-3 2Z" />
            <path d="M17 16c1.5 0 3 .5 3 2s-1.5 2-3 2-3-.5-3-2 1.5-2 3-2Z" />
            <path d="M12 9h.01" />
            <path d="M13 2.5V5a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h.5" />
            <path d="M17.5 17.5 16 7l-4.5 3-4-3 9 4 1 5.5" />
          </svg>
        );
      case 'respiratory':
        return <Activity className="w-4 h-4" />;
      case 'skin':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 5c1.5 3.5 3.5 4.5 5 4.5a7.5 7.5 0 0 1 3.5-4 10 10 0 0 1 2.5-.5c0-1.5 1-2 2-3s0 0 0 0c2 0 3.5 1 3.5 2.5s-1 2.5-3 2.5c0 0 0 0 0 0a4 4 0 0 0-3 2 3 3 0 0 0 0 3" />
            <path d="M16.5 9.5A5.5 5.5 0 0 0 17 12a5 5 0 0 1 0 3" />
            <path d="M18.5 14c.5 1 .5 2-.5 3s-6 2-7 2.5a3 3 0 0 1-3-1" />
          </svg>
        );
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex flex-col w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3Z" fill="currentColor" />
            <path d="M19 5H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
            <path d="M12 11v8" />
            <path d="m8 15-2 4" />
            <path d="m16 15 2 4" />
          </svg>
          <span className="font-semibold text-lg">Human Body Anatomy Viewer</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleControls}
            className="p-2 hover:bg-gray-700 rounded"
            title={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-grow overflow-hidden">
        {showControls && (
          <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Body Systems
            </h3>
            
            <div className="space-y-2">
              {Object.keys(systemUrls).map(system => (
                <button 
                  key={system}
                  onClick={() => changeSystem(system)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                    activeSystem === system 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <SystemIcon system={system} />
                  <span className="capitalize">{system}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-white rounded shadow border border-gray-200">
              <h4 className="font-medium mb-2 capitalize">{activeSystem} System</h4>
              <p className="text-sm text-gray-600">{systemDescriptions[activeSystem]}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Navigation Tips</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-blue-500" />
                  <span>Mouse wheel to zoom in/out</span>
                </li>
                <li className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-blue-500" />
                  <span>Click and drag to rotate</span>
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Use the Zygote controls to adjust visibility</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        <div className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-700">Loading 3D model...</p>
              </div>
            </div>
          )}         
          <iframe
            ref={iframeRef}
            src={systemUrls[activeSystem]}
            className="w-full h-full border-0"
            title="Zygote Body Human Anatomy Viewer"
            onLoad={handleIframeLoad}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs text-gray-700 shadow-md">
            Powered by <a href="https://www.zygotebody.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Zygote Body</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZygoteBodyViewer;