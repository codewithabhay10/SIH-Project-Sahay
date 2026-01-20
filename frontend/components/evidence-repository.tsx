"use client";

import React, { useState } from 'react';
import { Evidence, EvidenceCategory } from '@/lib/types';
import { getEvidenceCounts, formatFileSize } from '@/lib/ia-mock-data';

interface EvidenceRepositoryProps {
  evidence: Evidence[];
  onUpload: () => void;
}

export default function EvidenceRepository({ evidence, onUpload }: EvidenceRepositoryProps) {
  const [activeTab, setActiveTab] = useState<EvidenceCategory | 'all'>('all');
  
  const counts = getEvidenceCounts(evidence);
  
  const filteredEvidence = activeTab === 'all'
    ? evidence
    : evidence.filter(e => e.category === activeTab);

  const getCategoryIcon = (category: EvidenceCategory) => {
    if (category === 'photo') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.08334 8.33333C7.77369 8.33333 8.33334 7.77369 8.33334 7.08333C8.33334 6.39298 7.77369 5.83333 7.08334 5.83333C6.39298 5.83333 5.83334 6.39298 5.83334 7.08333C5.83334 7.77369 6.39298 8.33333 7.08334 8.33333Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 12.5L13.3333 8.33333L4.16667 17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    
    if (category === 'video') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M18.3333 5.00001L12.5 9.16667L18.3333 13.3333V5.00001Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.6667 4.16667H3.33333C2.41286 4.16667 1.66666 4.91286 1.66666 5.83333V14.1667C1.66666 15.0871 2.41286 15.8333 3.33333 15.8333H11.6667C12.5871 15.8333 13.3333 15.0871 13.3333 14.1667V5.83333C13.3333 4.91286 12.5871 4.16667 11.6667 4.16667Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M11.6667 1.66667H5C4.07953 1.66667 3.33334 2.41286 3.33334 3.33334V16.6667C3.33334 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V6.66667L11.6667 1.66667Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6667 1.66667V6.66667H16.6667"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const getFileCard = (item: Evidence) => {
    const isImage = item.category === 'photo';
    const isVideo = item.category === 'video';
    const isDoc = item.category === 'document';

    return (
      <div
        key={item.id}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      >
        {/* Thumbnail/Icon */}
        <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          {isImage && item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`${isVideo ? 'text-purple-500' : 'text-orange-500'}`}>
              {getCategoryIcon(item.category)}
            </div>
          )}
          
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5 3L12 8L5 13V3Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          )}
          
          {isDoc && (
            <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
              isDoc ? 'bg-orange-100 text-orange-700' : ''
            }`}>
              DOCUMENT
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
              {item.name}
            </p>
            {isImage && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex-shrink-0">
                <svg className="inline w-3 h-3 mr-0.5" viewBox="0 0 12 12" fill="none">
                  <path d="M10 2H2C1.44772 2 1 2.44772 1 3V9C1 9.55228 1.44772 10 2 10H10C10.5523 10 11 9.55228 11 9V3C11 2.44772 10.5523 2 10 2Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4.5 6C5.05228 6 5.5 5.55228 5.5 5C5.5 4.44772 5.05228 4 4.5 4C3.94772 4 3.5 4.44772 3.5 5C3.5 5.55228 3.94772 6 4.5 6Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M11 7.5L8.5 5L2 10" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatFileSize(item.size)}</span>
            <span>{item.uploadDate}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with tabs and upload button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-[#EA9000] border-b-2 border-[#EA9000] -mb-px'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'photo'
                ? 'text-[#EA9000] border-b-2 border-[#EA9000] -mb-px'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Photos ({counts.photos})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'video'
                ? 'text-[#EA9000] border-b-2 border-[#EA9000] -mb-px'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Videos ({counts.videos})
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'document'
                ? 'text-[#EA9000] border-b-2 border-[#EA9000] -mb-px'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Documents ({counts.documents})
          </button>
        </div>
        
        <button
          onClick={onUpload}
          className="px-4 py-2 bg-[#EA9000] text-white text-sm font-medium rounded-lg hover:bg-[#d88000] transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.3333 5.33333L8 2L4.66667 5.33333"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 2V10"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Upload Evidence
        </button>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredEvidence.map(item => getFileCard(item))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No {activeTab !== 'all' ? activeTab + 's' : 'evidence'} uploaded yet</p>
        </div>
      )}
    </div>
  );
}
