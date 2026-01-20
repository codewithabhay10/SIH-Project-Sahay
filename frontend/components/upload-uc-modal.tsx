"use client";

import React, { useState, useRef } from 'react';
import { Project } from '@/lib/types';

interface UploadUCModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpload: (file: File) => void;
}

export default function UploadUCModal({
  isOpen,
  onClose,
  project,
  onUpload
}: UploadUCModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    // Basic validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload Utilization Certificate</h2>
          <p className="text-sm text-gray-600 mt-1">Upload UC document for this project</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Project Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Project Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Project ID</p>
                <p className="font-medium text-gray-900">{project.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Allocated</p>
                <p className="font-medium text-gray-900">₹{project.allocated.toFixed(1)}Cr</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Project Name</p>
                <p className="font-medium text-gray-900">{project.name}</p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document <span className="text-red-500">*</span>
              </label>
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-[#EA9000] bg-orange-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 2V9H20"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 8L12 3L7 8"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 3V15"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drop your file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#EA9000] hover:text-[#d88000] font-semibold"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  </>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  onClose();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile}
                className="px-4 py-2 bg-[#EA9000] text-white rounded-lg font-medium hover:bg-[#d88000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload UC
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
