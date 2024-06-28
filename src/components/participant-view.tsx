import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk';

const MyParticipantView = () => {
  const { useParticipants } = useCallStateHooks();
  const [firstParticipant] = useParticipants();
  return firstParticipant ? <ParticipantView participant={firstParticipant} /> : <>Host is not connected</>;
};

export default MyParticipantView;
