"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface ZegoMeetingRoomProps {
  roomID: string;
  userName: string;
  userID: string;
  onLeave: () => void;
}

export default function ZegoMeetingRoom({ roomID, userName, userID, onLeave }: ZegoMeetingRoomProps) {
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const externalContainerRef = useRef<HTMLDivElement | null>(null);
  const zegoInstanceRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for DOM to be ready
    if (typeof window === 'undefined') return;
    if (!meetingContainerRef.current) return;
    if (isInitialized) return;

    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || '';
    const safeRoomID = roomID?.trim();
    const safeUserID = userID?.trim();
    const safeUserName = userName?.trim();
    
    // Validate credentials
    if (!appID || !serverSecret || isNaN(appID)) {
      console.error('ZEGOCLOUD: Invalid credentials. Please check your environment variables.');
      return;
    }

    if (!safeRoomID || !safeUserID || !safeUserName) {
      console.error('ZEGOCLOUD: Missing roomID/userID/userName.');
      return;
    }

    // Delay initialization to ensure DOM is fully ready
    const timer = setTimeout(() => {
      try {
        // Create an external container appended to body to host SDK-managed DOM.
        // This prevents React from managing SDK children and avoids removeChild races.
        if (!externalContainerRef.current) {
          const ext = document.createElement('div');
          ext.className = 'zego-external-container';
          // make it full-screen fixed so SDK UI appears as an overlay
          ext.style.position = 'fixed';
          ext.style.top = '0';
          ext.style.left = '0';
          ext.style.width = '100vw';
          ext.style.height = '100vh';
          ext.style.minHeight = '600px';
          ext.style.zIndex = '9999';
          ext.style.background = 'transparent';
          externalContainerRef.current = ext;
          try { document.body.appendChild(ext); } catch (err) { /* ignore */ }
        }

        // Generate Kit Token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          safeRoomID,
          safeUserID,
          safeUserName
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;
        setIsInitialized(true);

        // Start the call
        zp.joinRoom({
      container: externalContainerRef.current || meetingContainerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showPreJoinView: false,
      showScreenSharingButton: true,
      showRoomDetailsButton: true,
      showUserList: true,
      maxUsers: 50,
      layout: "Auto",
      showLayoutButton: true,
      showNonVideoUser: true,
      showOnlyAudioUser: true,
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      useFrontFacingCamera: true,
      onLeaveRoom: () => {
        onLeave();
      },
      branding: {
        logoURL: "",
      },
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showTextChat: true,
      showUserName: true,
      lowerLeftNotification: {
        showUserJoinAndLeave: true,
        showTextChat: true,
      },
        });

      } catch (error) {
        console.error('ZEGOCLOUD: Failed to initialize meeting room', error);
        setIsInitialized(false);
      }
    }, 100); // Small delay to ensure DOM is ready

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);

      const instance = zegoInstanceRef.current;

      // If no instance, just remove external container if present
      if (!instance) {
        if (externalContainerRef.current && externalContainerRef.current.parentNode) {
          try { externalContainerRef.current.parentNode.removeChild(externalContainerRef.current); } catch (_) { /* ignore */ }
          externalContainerRef.current = null;
        }
        return;
      }

      try {
        const destroyResult = instance.destroy();
        if (destroyResult && typeof destroyResult.then === 'function') {
          destroyResult.then(() => {
            if (externalContainerRef.current && externalContainerRef.current.parentNode) {
              try { externalContainerRef.current.parentNode.removeChild(externalContainerRef.current); } catch (_) { /* ignore */ }
              externalContainerRef.current = null;
            }
          }).catch(() => {
            if (externalContainerRef.current && externalContainerRef.current.parentNode) {
              try { externalContainerRef.current.parentNode.removeChild(externalContainerRef.current); } catch (_) { /* ignore */ }
              externalContainerRef.current = null;
            }
          });
        } else {
          if (externalContainerRef.current && externalContainerRef.current.parentNode) {
            try { externalContainerRef.current.parentNode.removeChild(externalContainerRef.current); } catch (_) { /* ignore */ }
            externalContainerRef.current = null;
          }
        }
      } catch (error) {
        console.debug('ZEGOCLOUD: cleanup error', error);
        if (externalContainerRef.current && externalContainerRef.current.parentNode) {
          try { externalContainerRef.current.parentNode.removeChild(externalContainerRef.current); } catch (_) { /* ignore */ }
          externalContainerRef.current = null;
        }
      } finally {
        zegoInstanceRef.current = null;
      }
    };
  }, [roomID, userName, userID, onLeave]);

  return (
    <div 
      ref={meetingContainerRef} 
      className="w-full h-full min-h-[600px] rounded-lg overflow-hidden bg-gray-900"
      style={{ width: '100%', height: '100%' }}
    >
      {!isInitialized && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Initializing meeting room...</p>
          </div>
        </div>
      )}
    </div>
  );
}
