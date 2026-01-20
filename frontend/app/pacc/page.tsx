"use client";

import React, { useState, useEffect } from 'react';
import { useTranslationApi } from '@/lib/use-translation-api';
import DashboardLayout from '@/components/dashboard-layout';
import ZegoMeetingRoom from '@/components/zego-meeting-room';
import LanguageSwitcherApi from '@/components/language-switcher-api';
import { PACCMeeting } from '@/lib/types';
import { getPACCMeetings, getUpcomingMeetings, getCompletedMeetings, mockProposals, mockAttendees } from '@/lib/pacc-mock-data';

type TabType = 'All Meetings' | 'Upcoming' | 'Completed';

const TEXTS = {
  title: 'Project Appraisal Committee (PACC)',
  subtitle: 'Schedule and manage PACC meetings, review proposals, and track outcomes',
  scheduleMeetingButton: 'Schedule Meeting',
  tabAllMeetings: 'All Meetings',
  tabUpcoming: 'Upcoming',
  tabCompleted: 'Completed',
  organizedBy: 'Organized by',
  statusUpcoming: 'Upcoming',
  statusCompleted: 'Completed',
  statusInProgress: 'In Progress',
  joinMeetingButton: 'Join Meeting',
  addProposalButton: 'Add Proposal',
  viewMOMButton: 'View MOM',
  participants: 'participants',
  proposals: 'proposals',
  
  // Schedule Meeting Modal
  scheduleModalTitle: 'Schedule New Meeting',
  meetingTitleLabel: 'Meeting Title',
  required: '*',
  meetingTitlePlaceholder: 'Enter meeting title',
  dateLabel: 'Date',
  timeLabel: 'Time',
  durationLabel: 'Duration',
  participantsLabel: 'Select Participants',
  participantsSelected: 'participants selected',
  attachProposalsLabel: 'Attach Proposals to Agenda',
  proposalsSelected: 'proposals selected',
  cancelButton: 'Cancel',
  scheduleButton: 'Schedule Meeting',
  
  // Duration options
  duration1Hour: '1 hour',
  duration1_5Hours: '1.5 hours',
  duration2Hours: '2 hours',
  duration2_5Hours: '2.5 hours',
  duration3Hours: '3 hours',
  
  // Add Proposal Modal
  addProposalModalTitle: 'Add Proposals to Agenda',
  
  // Success messages
  meetingScheduledSuccess: 'Meeting scheduled successfully!',
  proposalsAddedSuccess: 'Proposals added to agenda successfully!',
  momGeneratedSuccess: 'MOM generated successfully!'
};

export default function PACCPage() {
  const { t, language, translateMultiple } = useTranslationApi();
  const [activeTab, setActiveTab] = useState<TabType>('All Meetings');
  const [isTranslating, setIsTranslating] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const allMeetings = getPACCMeetings();
  const upcomingMeetings = getUpcomingMeetings();
  const completedMeetings = getCompletedMeetings();

  useEffect(() => {
    const loadTranslations = async () => {
      console.log('PACC Page: Language changed to', language);
      setIsTranslating(true);
      if (language === 'en') {
        // Reset to original texts for English
        setIsTranslating(false);
        setRenderKey(prev => prev + 1); // Force re-render
      } else {
        // Collect all meeting titles to translate
        const meetingTitles = allMeetings.reduce((acc, meeting) => {
          acc[meeting.title] = meeting.title;
          return acc;
        }, {} as { [key: string]: string });
        
        // Combine TEXTS and meeting titles
        const allTexts = { ...TEXTS, ...meetingTitles };
        await translateMultiple(allTexts);
        setIsTranslating(false);
        setRenderKey(prev => prev + 1); // Force re-render after translation
      }
      console.log('PACC Page: Translation complete, forcing re-render');
    };
    loadTranslations();
  }, [language, translateMultiple]);
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<PACCMeeting | null>(null);
  const [isViewMOMModal, setIsViewMOMModal] = useState(false);
  const [isAddProposalModal, setIsAddProposalModal] = useState(false);
  const [isMeetingRoomModal, setIsMeetingRoomModal] = useState(false);
  
  // Form state for new meeting
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    type: 'Review' as const,
    date: '',
    time: '',
    duration: 120,
    selectedAttendees: [] as string[],
    selectedProposals: [] as string[]
  });

  const getMeetingsForTab = () => {
    switch (activeTab) {
      case 'Upcoming':
        return upcomingMeetings;
      case 'Completed':
        return completedMeetings;
      default:
        return allMeetings;
    }
  };

  const handleScheduleMeeting = () => {
    console.log('Scheduling meeting:', newMeeting);
    alert(t(TEXTS.meetingScheduledSuccess));
    setIsScheduleModalOpen(false);
    setNewMeeting({
      title: '',
      type: 'Review',
      date: '',
      time: '',
      duration: 120,
      selectedAttendees: [],
      selectedProposals: []
    });
  };

  const handleJoinMeeting = (meeting: PACCMeeting) => {
    setSelectedMeeting(meeting);
    setIsMeetingRoomModal(true);
  };

  const handleGenerateMOM = () => {
    alert(t(TEXTS.momGeneratedSuccess));
    setIsMeetingRoomModal(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div key={renderKey}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2C3E50]">{t(TEXTS.title)}</h1>
            <p className="text-gray-600 mt-1">{t(TEXTS.subtitle)}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcherApi />
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#EA9000] rounded-lg hover:bg-[#d18200]"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4.16667V15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16667 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t(TEXTS.scheduleMeetingButton)}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['All Meetings', 'Upcoming', 'Completed'] as TabType[]).map((tab) => {
            const tabText = tab === 'All Meetings' ? TEXTS.tabAllMeetings : 
                          tab === 'Upcoming' ? TEXTS.tabUpcoming : TEXTS.tabCompleted;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-orange-100 text-[#EA9000]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(tabText)}
              </button>
            );
          })}
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getMeetingsForTab().map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {/* Meeting Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-1">{t(meeting.title)}</h3>
                  <p className="text-sm text-gray-600">{t(TEXTS.organizedBy)} {meeting.organizer}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  meeting.status === 'Upcoming' 
                    ? 'bg-blue-100 text-blue-700' 
                    : meeting.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {meeting.status === 'Upcoming' ? t(TEXTS.statusUpcoming) :
                   meeting.status === 'Completed' ? t(TEXTS.statusCompleted) : t(TEXTS.statusInProgress)}
                </span>
              </div>

              {/* Meeting Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                    <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.33333 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 6.66667H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{formatDate(meeting.date)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 4V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{meeting.time} ({meeting.duration} minutes)</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                    <path d="M11.3333 14V12.6667C11.3333 11.9594 11.0524 11.2811 10.5523 10.781C10.0522 10.281 9.37391 10 8.66667 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947619 11.2811 0.666667 11.9594 0.666667 12.6667V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="4.66667" r="2.66667" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M15.3333 14V12.6667C15.3333 12.0696 15.0953 11.4972 14.6703 11.0721C14.2452 10.6471 13.6728 10.4091 13.0757 10.4091" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 1.07574C11.2651 1.27131 11.8388 1.50934 12.0667 2.07574C12.2946 2.64214 12.2946 3.35908 12.0667 3.92548C11.8388 4.49188 11.2651 4.72991 10.6667 4.92548" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{meeting.attendees.length} {t(TEXTS.participants)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                    <path d="M9.33333 2H4C3.64638 2 3.30724 2.14048 3.05719 2.39052C2.80714 2.64057 2.66667 2.97971 2.66667 3.33333V13.3333C2.66667 13.687 2.80714 14.0261 3.05719 14.2761C3.30724 14.5262 3.64638 14.6667 4 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V6L9.33333 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.33333 2V6H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{meeting.proposalsOnAgenda.length} {t(TEXTS.proposals)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {meeting.status === 'Upcoming' && (
                  <>
                    <button
                      onClick={() => handleJoinMeeting(meeting)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#EA9000] rounded-lg hover:bg-[#d18200]"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14.6667 4L8 8L1.33333 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 14.6667V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {t(TEXTS.joinMeetingButton)}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setIsAddProposalModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {t(TEXTS.addProposalButton)}
                    </button>
                  </>
                )}
                {meeting.status === 'Completed' && meeting.mom && (
                  <button
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setIsViewMOMModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8C2 8 4 4 8 4C12 4 14 8 14 8C14 8 12 12 8 12C4 12 2 8 2 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    {t(TEXTS.viewMOMButton)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {getMeetingsForTab().length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-gray-400">
                <path d="M26.6667 5.33333H5.33333C4.59695 5.33333 4 5.93029 4 6.66667V26.6667C4 27.403 4.59695 28 5.33333 28H26.6667C27.403 28 28 27.403 28 26.6667V6.66667C28 5.93029 27.403 5.33333 26.6667 5.33333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.3333 2.66667V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 2.66667V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 13.3333H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('pacc.noMeetings.title')}</h3>
            <p className="text-gray-500 mb-4">{t('pacc.noMeetings.description')}</p>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{t(TEXTS.scheduleModalTitle)}</h2>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Meeting Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(TEXTS.meetingTitleLabel)} <span className="text-red-500">{t(TEXTS.required)}</span>
                </label>
                <input
                  type="text"
                  placeholder={t(TEXTS.meetingTitlePlaceholder)}
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(TEXTS.dateLabel)} <span className="text-red-500">{t(TEXTS.required)}</span>
                  </label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(TEXTS.timeLabel)} <span className="text-red-500">{t(TEXTS.required)}</span>
                  </label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(TEXTS.durationLabel)} <span className="text-red-500">{t(TEXTS.required)}</span>
                </label>
                <select
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none bg-white"
                >
                  <option value={60}>{t(TEXTS.duration1Hour)}</option>
                  <option value={90}>{t(TEXTS.duration1_5Hours)}</option>
                  <option value={120}>{t(TEXTS.duration2Hours)}</option>
                  <option value={150}>{t(TEXTS.duration2_5Hours)}</option>
                  <option value={180}>{t(TEXTS.duration3Hours)}</option>
                </select>
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t(TEXTS.participantsLabel)} <span className="text-red-500">{t(TEXTS.required)}</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                  {mockAttendees.map((attendee) => (
                    <label key={attendee.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={newMeeting.selectedAttendees.includes(attendee.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewMeeting({
                              ...newMeeting,
                              selectedAttendees: [...newMeeting.selectedAttendees, attendee.id]
                            });
                          } else {
                            setNewMeeting({
                              ...newMeeting,
                              selectedAttendees: newMeeting.selectedAttendees.filter(id => id !== attendee.id)
                            });
                          }
                        }}
                        className="w-4 h-4 text-[#EA9000] border-gray-300 rounded focus:ring-[#EA9000]"
                      />
                      <span className="text-sm text-gray-900">{attendee.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {newMeeting.selectedAttendees.length} {t(TEXTS.participantsSelected)}
                </p>
              </div>

              {/* Attach Proposals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t(TEXTS.attachProposalsLabel)}
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                  {mockProposals.map((proposal) => (
                    <label key={proposal.id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={newMeeting.selectedProposals.includes(proposal.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewMeeting({
                              ...newMeeting,
                              selectedProposals: [...newMeeting.selectedProposals, proposal.id]
                            });
                          } else {
                            setNewMeeting({
                              ...newMeeting,
                              selectedProposals: newMeeting.selectedProposals.filter(id => id !== proposal.id)
                            });
                          }
                        }}
                        className="w-4 h-4 text-[#EA9000] border-gray-300 rounded focus:ring-[#EA9000] mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{proposal.proposalTitle}</p>
                        <p className="text-xs text-gray-500">{proposal.proposalId} • {proposal.proposer}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {newMeeting.selectedProposals.length} {t(TEXTS.proposalsSelected)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t(TEXTS.cancelButton)}
              </button>
              <button
                onClick={handleScheduleMeeting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#EA9000] rounded-lg hover:bg-[#d18200] transition-colors"
              >
                {t(TEXTS.scheduleButton)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Proposals to Agenda Modal */}
      {isAddProposalModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{t(TEXTS.addProposalModalTitle)}</h2>
              <button
                onClick={() => setIsAddProposalModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Proposals List */}
              <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto space-y-2">
                {mockProposals.map((proposal) => (
                  <label key={proposal.id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#EA9000] border-gray-300 rounded focus:ring-[#EA9000] mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{proposal.proposalTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{proposal.proposalId} • {proposal.proposer}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                0 {t(TEXTS.proposalsSelected)}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsAddProposalModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t(TEXTS.cancelButton)}
              </button>
              <button
                onClick={() => {
                  alert(t(TEXTS.proposalsAddedSuccess));
                  setIsAddProposalModal(false);
                }}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#EA9000] rounded-lg hover:bg-[#d18200] transition-colors"
              >
                {t(TEXTS.addProposalButton)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Room Modal with ZegoCloud Video */}
      {isMeetingRoomModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-[#2C3E50]">{selectedMeeting.title}</h2>
                <p className="text-sm text-gray-600">{formatDate(selectedMeeting.date)} • {selectedMeeting.time}</p>
              </div>
              <button
                onClick={() => setIsMeetingRoomModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="flex-1 p-4 overflow-hidden">
              <ZegoMeetingRoom
                roomID={`pacc-${selectedMeeting.id}`}
                userName="PACC Member" // Replace with actual user name
                userID={`user-${Date.now()}`} // Replace with actual user ID
                onLeave={() => setIsMeetingRoomModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
