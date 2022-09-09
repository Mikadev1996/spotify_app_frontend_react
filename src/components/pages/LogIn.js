import React from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "../Footer";
import logo from '../../styles/spotify_white.png'

const LogIn = () => {
    const nav = useNavigate();

    return (
        <div className='app'>
            <div className="account-content">
                <div className='title-container'>
                    <h1>Spotify Playlist Generator</h1>
                    <p>Sick of creating monthly playlists? Want to get into a new genre of music?
                        This set of tools allows you to create a playlist recommendation
                        just by searching for a track!</p>
                </div>
                <div className="form-container">
                    <form className='spotify-container'>
                        <div>

                            <button className='form-submit' id='spotify-login' type="submit"><img src={logo} alt='logo'/><p>Log In with Spotify</p></button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default LogIn;