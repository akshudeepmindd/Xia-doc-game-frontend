// import { useAppData } from '@/context/AppProvider';
// import { authToken } from '@/services/http';
import Participant from './participants';

interface SpeakerScreenProps {
  meetingId: string;
  name: string;
  authToken: string;
}
const SpeakerScreen2 = ({ meetingId, authToken }: SpeakerScreenProps) => {
  return (
    <div>
      {/* <MediaControl /> */}
      <Participant meetingId={meetingId} authToken={authToken} />
    </div>
  );
};

export default SpeakerScreen2;
