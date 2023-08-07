import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from "react-player";
import peer from '../service/peer';
import "./../css/Room.css";
import { useSocket } from '../context/SocketProvider';

const Room = () => {

    const socket = useSocket();

    const [remoteSocketId, setRemoteSocketId] = useState(null);

    const [myStream, setMyStream] = useState();

    const [remoteStream, setRemoteStream] = useState();

    const [remoteEmail, setRemoteEmail] = useState();

    const navigate=useNavigate();

    const handleUserJoined = useCallback(({ email, id }) => {

        console.log(`Email ${email} joined the room`);
        setRemoteSocketId(id);
        setRemoteEmail(email);
        socket.emit('user:joined', { email:socket.email, id: socket.id });

    }, [])

    const handleCallUser = useCallback(async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        const offer = await peer.getOffer();

        socket.emit('user:call', { to: remoteSocketId, offer });

        setMyStream(stream);

    }, [remoteSocketId, socket])

    // const handleIncomingCall = useCallback(async ({ from, offer }) => {

    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: true,
    //         video: true
    //     });
    //     setMyStream(stream);

    //     setRemoteSocketId(from);

    //     console.log(`incoming call `, from, offer);
    //     const ans = await peer.getAnswer(offer);

    //     socket.emit('call:accepted', { to: from, ans });

    // }, [socket]);

    const handleIncomingCall = useCallback(async ({ from, offer, email }) => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        setMyStream(stream);
        setRemoteSocketId(from);
        setRemoteEmail(email);
        console.log(`incoming call `, from, offer);
        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted', { to: from, ans });
      }, [socket]);

    const sendStreams = useCallback(() => {

        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }

    }, [myStream]);

    const handleCallAccepted = useCallback(({ from, ans }) => {

        peer.setLocalDescription(ans);
        console.log("call accepted");
        sendStreams();

    }, [sendStreams])

    const handleNegoNeeded = useCallback(async () => {

        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId });

    }, [remoteSocketId, socket])

    const handleNegoNeedIncoming = useCallback(async ({ from, offer }) => {

        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans })

    }, [socket])

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {

        await peer.setLocalDescription(ans);

    }, [])

    const handleDisconnect = () => {

        socket.disconnect();
        navigate('/');
        window.location.reload();

    };

    useEffect(() => {

        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);

        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
        }

    }, [handleNegoNeeded])

    useEffect(() => {

        peer.peer.addEventListener('track', async ev => {

            const remotestream = ev.streams;
            setRemoteStream(remotestream[0]);

        })

    }, [])

    useEffect(() => {

        // handleUserJoined();

        socket.on("user:joined", handleUserJoined);

        socket.on("incoming:call", ({ from, offer, email }) => {
            handleIncomingCall({ from, offer, email });
        });

        socket.on("call:accepted", handleCallAccepted);

        socket.on("peer:nego:needed", handleNegoNeedIncoming);

        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncoming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        }

    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoNeedIncoming, handleNegoNeedFinal])

    return (

        <div id='roommid'>

            <div id='midmsg'>
                {remoteSocketId ? `${remoteEmail} Connected` : "No one in the Booth"}
            </div>

            <div id='midstreams'>

                <div className='streamm'>

                    {myStream && (
                        // {/* <h3>My Stream</h3> */}
                        <ReactPlayer className='livestreamm' playing width="100%" height='100%' url={myStream} />
                    )}

                </div>

                <div className='streamm'>

                    {remoteStream && (
                        // <h3>Remote Stream</h3>
                        <ReactPlayer playing width="100%" height='100%' url={remoteStream} />
                    )}

                </div>

            </div>

            <div id='streambuttons'>

                {myStream && <button className='streambt' onClick={sendStreams}>ACCEPT CALL</button>}

                {remoteSocketId && <button className='streambt' onClick={handleCallUser}>CALL</button>}

                <button className='streambt' onClick={handleDisconnect}>DISCONNECT</button>

            </div>







        </div>

    )
}

export default Room;