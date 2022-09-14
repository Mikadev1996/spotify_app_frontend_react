import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "../Footer";
import logo from '../../styles/spotify_white.png'

const LogIn = () => {
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('access_token')) getUserDetails();
    }, [])

    const nav = useNavigate();

    const deployUrl = 'https://spotify-django-app.azurewebsites.net';
    const prodUrl = 'http://localhost:8000'

    const getUserDetails = () => {
        const access_token = localStorage.getItem('access_token');
        const formData = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }

        fetch('https://api.spotify.com/v1/me', formData)
            .then(r => r.json())
            .then(data => {
                if (data.error) return setError(data.error.message);
                localStorage.setItem('user', JSON.stringify(data));
                nav('/home');

            })
            .catch(err => console.log(err));
    }

    const spotifyLogin = (e) => {
        e.preventDefault();
        fetch(`${deployUrl}/spotify/get-auth-url`)
            .then(r => r.json())
            .then(data => window.location.replace(data.url))
            .catch(err => console.log(err))
    }

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

                        <button onClick={(e) => spotifyLogin(e)} className='form-submit' id='spotify-login' type="submit">
                            <img src={logo} alt='logo'/><p>Log In with Spotify</p>
                        </button>
                            {error && <small>{error}, please log in again</small>}
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default LogIn;