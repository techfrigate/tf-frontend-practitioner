import React from 'react'

const FileUpload = ({file, setFile}) => {

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <div className="flex items-center p-6 rounded-lg shadow-md  hover:shadow-lg transition-shadow duration-300">
        <div className="w-1/4 text-left mr-6">
          <label className="block text-gray-800 font-semibold mb-2">
            User's Photo
          </label>
          <p className="text-gray-600 text-sm">
            This will be displayed on User's profile.
          </p>
        </div>
        <div className="flex items-center w-3/4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#1e817e] text-white flex items-center justify-center overflow-hidden shadow-md">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold">PP</span>
            )}
          </div>
          <label
            htmlFor="file-upload"
            className="ml-6 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#1e817e] rounded-lg p-6 w-full text-center bg-white hover:bg-green-50 transition duration-300"
          >
            <div className="text-[#1e817e] font-semibold">
              Click to Upload or drag and drop
            </div>
            <div className="text-gray-500 text-sm">
              PNG, JPG, JPEG (min. 1024x1024px)
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
            />
          </label>
        </div>
      </div>
  )
}

export default FileUpload