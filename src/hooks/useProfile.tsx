import { useEffect, useState } from 'react';

const useProfile = () => {
  const [userId, setUserId] = useState('');
  const [roomOwner, setRoomOwner] = useState(false);
  const [username, setUsername] = useState('');
  const [isSbo, setIsSbo] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setRoomOwner(localStorage.getItem('roomOwner') === 'true');
    setIsSbo(localStorage.getItem('sbo') === 'true');
    setUsername(localStorage.getItem('username') || '');
  }, []);

  return {
    userId,
    roomOwner,
    username,
    isSbo,
  };
};

export default useProfile;
