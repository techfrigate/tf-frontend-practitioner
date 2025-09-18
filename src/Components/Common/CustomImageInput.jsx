import React from 'react';
import { ImageIcon, Upload } from 'lucide-react';

const CustomImageInput = ({
  id,
  label,
  isInvalid = false,
  onchange,
  imageUrl,
}) => {
  return (
    <div className="w-full">
         <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {imageUrl ? (
            <div className="mb-4 relative group cursor-pointer">
            <input
              type="file"
              id={id}
              accept="image/*"
              onChange={onchange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className="relative">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-48 object-contain rounded-lg border border-gray-200 shadow-sm"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Change Image
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 ${
              isInvalid ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
            } hover:border-[#64C6B0] hover:bg-[#64C6B0]/5 transition-all cursor-pointer group`}
          >
            <input
              type="file"
              id={id}
              accept="image/*"
              onChange={onchange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white rounded-full border border-gray-200 shadow-sm group-hover:border-[#64C6B0] transition-colors">
                <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-[#64C6B0]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#64C6B0]">
                  Click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isInvalid && (
        <p className="mt-2 text-sm text-red-600">Please provide an image</p>
      )}
    </div>
  );
};

export default CustomImageInput;
