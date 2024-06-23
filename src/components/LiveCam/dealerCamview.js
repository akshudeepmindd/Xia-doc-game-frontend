import { MeetingProvider } from "@videosdk.live/react-sdk";
import React from "react";
import MediaControlsContainer from "./MediaViewContainer";

const SpeakerScreenContainer = ({
  authToken,
  meetingId,
  name,
  mode,
  StartLive,
}) => {
  return (
    <MeetingProvider
      token={authToken}
      config={{
        meetingId,
        name: name,
        micEnabled: false,
        webcamEnabled: mode === "Viewer" ? false : true,
        mode: mode,
      }}
      joinWithoutUserInteraction
    >
      <MediaControlsContainer meetingId={meetingId} StartLive={StartLive} />
    </MeetingProvider>
  );
};

export default SpeakerScreenContainer;
