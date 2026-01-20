"use client";

import React, { useState, useRef } from 'react';
import { Evidence, EvidenceCategory } from '@/lib/types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], category: EvidenceCategory) => void;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload
}: UploadDocumentModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<EvidenceCategory>('photo');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB
      return file.size <= maxSize;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, category);
      setSelectedFiles([]);
      setCategory('photo');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload Evidence</h2>
          <p className="text-sm text-gray-600 mt-1">Upload multiple photos, videos, or documents</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(['photo', 'video', 'document'] as EvidenceCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium text-sm capitalize transition-colors ${
                    category === cat
                      ? 'border-[#EA9000] bg-orange-50 text-[#EA9000]'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files <span className="text-red-500">*</span>
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
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Drop files here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#EA9000] hover:text-[#d88000] font-semibold"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">Multiple files supported. Max 50MB per file</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              accept="image/*,video/*,.pdf,.doc,.docx"
              multiple
              className="hidden"
            />
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Files ({selectedFiles.length})
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M11.6667 1.66667H5C4.07953 1.66667 3.33334 2.41286 3.33334 3.33334V16.6667C3.33334 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.6667 1.66667V6.66667H16.6667" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setSelectedFiles([]);
                setCategory('photo');
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedFiles.length === 0}
              className="px-4 py-2 bg-[#EA9000] text-white rounded-lg font-medium hover:bg-[#d88000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
