import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef } from 'react';
import ReactPlayer from 'react-player';

const Participant = () => {
  const { participants } = useMeeting();
  const [participantId, ...otherParticipants] = participants.keys();

  console.log('otherParticipants', otherParticipants);

  const { micOn, micStream, isLocal, webcamOn, webcamStream } = useParticipant(participantId);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  const vidoeStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      console.log('webcamStream?.track', webcamStream?.track);
      mediaStream.addTrack(webcamStream?.track);
      return mediaStream;
    }
  }, [webcamOn, webcamStream]);

  useEffect(() => {
    if (!isLocal && audioPlayer.current && micStream && micOn) {
      const mediaStream = new MediaStream();
      console.log('webcamStream?.track', webcamStream?.track);
      mediaStream.addTrack(micStream.track);

      audioPlayer.current.src = micStream;
      audioPlayer.current.play().catch((error) => {
        if (error.message === "play() failed because the user didn't interact with the document first.") {
          console.log("User didn't interact with the document first");
        }
      });
    } else {
      audioPlayer.current.src = null;
    }
  }, [micOn, micStream, isLocal]);

  return (
    <div style={{ height: 200, width: 360, position: 'relative' }}>
      <audio autoPlay playsInline controls={false} ref={audioPlayer} />
      {/* <div
        style={{
          position: "absolute",
          backgroundColor: "#ffffffb3",
          padding: 8,
        }}
      >
        <p>{displayName}</p>
        <p>{micOn ? "Mic On" : "Mic Off"}</p>
        <p>{webcamOn ? "Webcam On" : "Webcam Off"}</p>
      </div> */}
      {webcamOn && (
        <ReactPlayer
          playsinline
          muted
          pip={false}
          light={false}
          playing={true}
          url={vidoeStream?.toURL()} // Convert the Stream object to a string URL
          height="100%"
          width="100%"
          onError={(error) => console.log(error)}
        />
      )}
    </div>
  );
};

export default Participant;
