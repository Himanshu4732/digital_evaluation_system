import React, { useState, useRef } from "react";

const ProfileImageUpload = ({ avatar, setAvatar }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Profile Image
      </label>
      
      <div className="flex items-center space-x-4">
        <div 
          onClick={triggerFileInput}
          className="w-16 h-16 rounded-full bg-zinc-700 border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <svg 
              className="w-6 h-6 text-zinc-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={triggerFileInput}
            className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-3 rounded-md transition-colors"
          >
            {preview ? 'Change Image' : 'Upload Image'}
          </button>
          
          <p className="text-xs text-zinc-400 mt-1">
            JPG, PNG or GIF (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;