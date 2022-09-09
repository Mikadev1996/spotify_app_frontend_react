import React from "react";

const Nav = ({toggleTheme, authenticateSpotify, user, getUser, songData}) => {
    return (
        <nav>
            <div className='nav-container'>
                <div className='nav-logo github-logo'>
                    <a href='https://github.com/ejones18/spotify_app'>
                        <img src="https://i.imgur.com/EVBHoFa.png" alt="github"/>
                    </a>
                </div>
                <div className='home-logo'>
                    <a href="/">
                        Spotify Playlist Generator
                    </a>
                </div>
                <div className='nav-last'>
                    <button onClick={() => console.log(songData)}>Log</button>
                    <button onClick={() => getUser()}>Get User</button>
                    {!user && <button onClick={() => authenticateSpotify()}>Log In</button>}
                    <button onClick={toggleTheme}>Toggle Theme</button>
                </div>
            </div>
        </nav>
    )
}

export default Nav;
