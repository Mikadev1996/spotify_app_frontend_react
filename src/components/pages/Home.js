import React,  { useState } from "react";
import useLocalStorage from 'use-local-storage'
import Nav from "../Nav";
import SearchSong from "../SearchSong";


function Home() {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('');
    const [queryResults, setQueryResults] = useState([]);
    const [songData, setSongData] = useState(null);
    const [playlistName, setPlaylistName] = useState('');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme)
    }

    const deployUrl = 'https://spotify-playlist-gen-django.azurewebsites.net';
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
                setUser(data);

            })
            .catch(err => console.log(err));
    }

    const spotifyLogIn = () => {
        const access_token = localStorage.getItem('access_token');
        const formData = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }

        fetch(`${deployUrl}/spotify_playlist_gen/is-authenticated`, formData)
            .then(r => r.json())
            .then(data => {
                if (!data.status) {
                    fetch(`${deployUrl}/spotify_playlist_gen/get-auth-url`)
                        .then(r => r.json())
                        .then(data => window.location.replace(data.url))
                        .catch(err => console.log(err))
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const searchSong = (e) => {
        e.preventDefault()
        const access_token = localStorage.getItem('access_token');
        const formData = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }

        let searchQuery = query;
        searchQuery = searchQuery.replaceAll(' ', '%20')


        fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&market=GB&limit=5`, formData)
            .then(r => r.json())
            .then(data => setQueryResults([...data.tracks.items]))
            .catch(err => console.log(err))
    }

    const generatePlaylist = (e) => {
        e.preventDefault()
        const access_token = localStorage.getItem('access_token');
        const formData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                track_id: songData.id,
                track_name: songData.name,
                artist_id: songData.artists[0].id,
                artist_name: songData.artists[0].name,
                playlist_name: playlistName ? playlistName : `Playlist generated based on ${songData.name} by ${songData.artists[0].name}`,
                token: access_token,
                user_id: user.id
            })
        }

        fetch(`${deployUrl}/spotify_playlist_gen/generate`, formData)
            .then(r => r.json())
            .then(data => displayPlaylist(data))
            .catch(err => console.log(err));
    }

    const displayPlaylist = (data) => {
        const access_token = localStorage.getItem('access_token');
        const formData = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }

        fetch(`https://api.spotify.com/v1/playlists/${data.playlist_id}`, formData)
            .then(r => r.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }

    return (
        <div className='app' data-theme={theme}>
            <Nav toggleTheme={toggleTheme} songData={songData} authenticateSpotify={spotifyLogIn} user={user} getUser={getUserDetails}/>

            <main className='content'>
                <div className="container">

                    <div className='form-container'>
                        <form className='account-form'>
                            <div className="form-control">
                                <label htmlFor="artist">Search for a Track</label>
                                <input type="text" placeholder="eg. 505 Arctic monkeys" id="artist" name='artist' maxLength='50' onChange={e => setQuery(e.target.value)}/>
                            </div>

                            <SearchSong queryResults={queryResults} setSongData={setSongData}/>

                            <div>
                                <button onClick={e => searchSong(e)} id='search-song-button' className='form-submit' type="submit">Search Song</button>
                            </div>
                            {songData &&
                            <div>
                                <button onClick={e => generatePlaylist(e)} id='generate-playlist-button' className='form-submit' type="submit">Generate playlist from selected song</button>
                            </div>}
                        </form>
                    </div>

                    {user &&
                    <div className='profile-container'>
                        <h1>Welcome, {user.display_name}!</h1>
                        <img src={user.images[0].url} alt='profile'/>
                    </div>
                    }

                </div>
            </main>
        </div>
    );
}

export default Home;
