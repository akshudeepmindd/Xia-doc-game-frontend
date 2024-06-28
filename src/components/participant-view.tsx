import {
  LivestreamPlayer,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = 'cuvjbzq9jruc';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY3NmJlN2VhYjBiNTczZmJhNzI1MDJhIiwiZXhwIjoxNzE5NTYzNTg3LCJpYXQiOjE3MTk1NTk5ODZ9.RFG-7UKRkjFRxKHa_5FN4u0t5zvGWwUjp8w0_eTE3H4';
const callId = 'ntzV5CDKF81q';

const user: User = { id: '6676be7eab0b573fba72502a', name: 'akdealer' };
const client = new StreamVideoClient({ apiKey, user, token });

const call = client.call('livestream', callId);
call.getOrCreate();

const ParticipantView = () => {
  return (
    <StreamTheme className="w-full h-full">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <LivestreamPlayer callId={callId} callType="livestream" />
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  );
};

export default ParticipantView;
