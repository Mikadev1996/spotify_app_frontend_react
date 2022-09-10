import React,  { useState, useEffect } from "react";
import useLocalStorage from 'use-local-storage'
import {useNavigate} from "react-router-dom";
import Nav from "../Nav";
import SearchSong from "../SearchSong";

function Home() {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('');
    const [queryResults, setQueryResults] = useState([]);
    const [songData, setSongData] = useState(null);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistData, setPlaylistData] = useState('');

    const nav = useNavigate();
    const deployUrl = 'https://spotify-django-app.azurewebsites.net';
    const prodUrl = 'http://localhost:8000'

    useEffect(() => {
        getUserDetails();
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme)
    }

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
                if (data.error) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    nav('/');
                }
                setUser(data);
            })
            .catch(err => console.log(err));
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
            .then(data => {
                if (data.error) {
                    localStorage.removeItem('access_token');
                    nav('/');
                    return;
                }
                setQueryResults([...data.tracks.items])
            })
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

        fetch(`${deployUrl}/spotify/generate`, formData)
            .then(r => r.json())
            .then(data => displayPlaylist(data.playlist_id))
            .catch(err => console.log(err));
    }

    const displayPlaylist = (id) => {
        const access_token = localStorage.getItem('access_token');
        const formData = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }



        fetch(`https://api.spotify.com/v1/playlists/${id}`, formData)
            .then(r => r.json())
            .then(data => setPlaylistData(data))
            .catch(err => console.log(err));
    }

    const PlaylistItem = ({id, image_url, track_name, artist_name, playlist_url}) => {
        return (
            <div key={id} className='song-item'>
                <img src={image_url} alt='song cover'/>
                <div>
                    <p className='track-name'>{track_name}</p>
                    <p className='artist-name'>{artist_name}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='app' data-theme={theme}>
            <Nav toggleTheme={toggleTheme} songData={songData}/>

            <main className='content'>
                <div className="container">

                    {user &&
                    <div className='profile-container'>
                        <img src={user.images[0].url} alt='profile'/>
                        <p>Welcome, {user.display_name}!</p>
                    </div>
                    }

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

                    {playlistData && <div className='form-container'>
                        <div className="form-header">
                            <h1>Your playlist!</h1>
                            <a href={playlistData.external_urls.spotify}> <p>Visit your Playlist Here!</p></a>
                        </div>
                        <form className='account-form'>
                            {playlistData.tracks.items.map(data => {
                                return (
                                    <PlaylistItem id={data.id}
                                                  image_url={data.track.album.images[1].url}
                                                  artist_name={data.track.artists[0].name}
                                                  track_name={data.track.name}
                                                  key={data.track.id}/>
                                )
                            })}
                        </form>
                    </div>}

                </div>
            </main>
        </div>
    );
}

export default Home;
