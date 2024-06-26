import { useEffect, useState } from 'react';

const useProfile = () => {
  const [userId, setUserId] = useState('');
  const [roomOwner, setRoomOwner] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setRoomOwner(localStorage.getItem('roomOwner') === 'true');
    setUsername(localStorage.getItem('username') || '');
  }, []);

  return {
    userId,
    roomOwner,
    username,
  };
};

export default useProfile;
