"use client";

import React, { useState } from 'react';
import { Project } from '@/lib/types';

interface RequestClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSubmit: (message: string) => void;
}

export default function RequestClarificationModal({
  isOpen,
  onClose,
  project,
  onSubmit
}: RequestClarificationModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request Clarification</h2>
          <p className="text-sm text-gray-600 mt-1">Send a clarification request for this project</p>
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
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-gray-900">{project.status}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Project Name</p>
                <p className="font-medium text-gray-900">{project.name}</p>
              </div>
              <div>
                <p className="text-gray-600">District</p>
                <p className="font-medium text-gray-900">{project.district}</p>
              </div>
              <div>
                <p className="text-gray-600">IA Type</p>
                <p className="font-medium text-gray-900">{project.iaType}</p>
              </div>
            </div>
          </div>

          {/* Clarification Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Clarification Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent resize-none"
                placeholder="Please describe what clarification you need regarding this project..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">{message.length} / 1000 characters</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-4 py-2 bg-[#EA9000] text-white rounded-lg font-medium hover:bg-[#d88000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
