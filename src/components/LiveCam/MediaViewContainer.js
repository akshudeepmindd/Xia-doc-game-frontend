import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import React, { useMemo } from "react";

const MediaControlsContainer = ({ StartLive }) => {
  const { toggleMic, toggleWebcam, startHls, stopHls, hlsState, meetingId } =
    useMeeting();

  const { isHlsStarted, isHlsStopped, isHlsPlayable } = useMemo(
    () => ({
      isHlsStarted: hlsState === Constants.hlsEvents.HLS_STARTED,
      isHlsStopped: hlsState === Constants.hlsEvents.HLS_STOPPED,
      isHlsPlayable: hlsState === Constants.hlsEvents.HLS_PLAYABLE,
    }),
    [hlsState]
  );

  const _handleToggleHls = () => {
    StartLive();
    if (isHlsStarted) {
      stopHls();
    } else if (isHlsStopped) {
      startHls({ quality: "high" });
    }
  };

  return (
    <div>
      <button onClick={_handleToggleHls}>
        {isHlsStarted ? "Stop Live" : "start Live"}
      </button>
    </div>
  );
};

export default MediaControlsContainer;
