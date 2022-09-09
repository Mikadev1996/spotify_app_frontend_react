import React, { useState } from "react";


function SearchSong({queryResults, setSongData}) {
    const [selected, setSelected] = useState('');

    const handleSelectSong = (id) => {
        setSelected(id)
        setSongData(queryResults.filter(item => item.id === id)[0]);
    }

    const SongItem = ({id, image_url, track_name, artist_name}) => {
        return (
            <div key={id} className='song-item'>
                <img src={image_url} alt='song cover'/>
                <div>
                    <p className='track-name'>{track_name}</p>
                    <p className='artist-name'>{artist_name}</p>
                </div>
                {selected === id ? <button style={{backgroundColor: 'darkred'}} onClick={() => handleSelectSong(id)}>Selected</button> : <button onClick={() => handleSelectSong(id)}>Select</button>}
            </div>
        )
    }

    return (
        <div>
            {queryResults.length > 0 && queryResults.map(data => {
                return (
                    <SongItem id={data.id}
                              image_url={data.album.images[1].url}
                              artist_name={data.artists[0].name}
                              track_name={data.name}
                              key={data.id}/>
                )
            })}
        </div>
    )
}

export default SearchSong
