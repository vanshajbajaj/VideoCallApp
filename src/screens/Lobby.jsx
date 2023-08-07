import { React, useCallback, useEffect, useState } from 'react';
import { useSocket } from "./../context/SocketProvider";
import { useNavigate } from 'react-router-dom';
import "./../css/Lobby.css";

const Lobby = () => {

  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');

  const navigate = useNavigate();

  const socket = useSocket();
  // console.log(socket);

  const handlejoinroom = useCallback((data) => {

    const { email, room } = data;
    // console.log(email, " ", room);
    navigate(`/room/${room}`);

  }, [navigate]);

  useEffect(() => {

    socket.on('room:join', handlejoinroom);
    return () => {
      socket.off('room:join', handlejoinroom);
    }

  }, [socket])

  const handleSubmitForm = useCallback(
    (e) => {

      e.preventDefault();

      socket.emit("room:join", { email, room });

    },
    [email, room, socket]
  );

  return (
    <div id='lobbymain' >

      <div id="lbmleft" className='flex-container'>

        <span id='lbmlogo'>ZOOMBOOTH</span>
        <span className='lbminfo'>The Virtual Booth That Brings You Closer</span>
        {/* <span className='lbminfo'></span> */}
        {/* <span className='lbminfo'>Closer</span> */}
        <span className='lbmdesc'>
          Connect with anyone, anywhere, anytime with our one-on-one video call platform. Enjoy a seamless video calling experience with high-quality audio and video. Our platform is easy to use so you can stay connected on the go. Start building meaningful connections today with ZoomBooth.
        </span>

      </div>

      <div id='lbmright' className='flex-container'>

        <span className='lbrhead'>ENTER DETAILS TO ENTER THE BOOTH</span>

        <form onSubmit={handleSubmitForm} id='lbrform'>

          <span className='lbrinp'>
            <label htmlFor='email'>Enter Email ID: </label>
            <input type='email' id='email' className='lbrinpinp' value={email} onChange={e => setEmail(e.target.value)} required/>
          </span>

          <span className='lbrinp'>
            <label htmlFor='room'>Room Number: </label>
            <input type='text' id='room' className='lbrinpinp' value={room} onChange={e => setRoom(e.target.value)} required/>
          </span>

          <button id='lbrbt'>ENTER BOOTH</button>

        </form>

      </div>

    </div>
  )
}

export default Lobby;