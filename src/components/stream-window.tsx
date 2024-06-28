import { CallControls, LivestreamPlayer } from '@stream-io/video-react-sdk';

// import the SDK provided styles

const SteamWindow = () => {
  return (
    <div className="h-full w-full">
      <LivestreamPlayer callId="ntzV5CDKF81q" callType="livestream" />
    </div>
  );
};

export default SteamWindow;
