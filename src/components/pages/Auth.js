import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Auth() {
    const { access_token } = useParams()
    const { refresh_token } = useParams()
    const [error , setError] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (access_token.length > 0) {
            localStorage.setItem('access_token', access_token);

            if (refresh_token) {
                localStorage.setItem('refresh_token', refresh_token);
            }

            nav('/home');
        }

        else {
            setError(true);
            setTimeout(() => {
                nav('/');
            }, 2000)
        }
    }, [])

    return (
        <div>
            {error && <h1>Error... please try again</h1>}
        </div>
    )
}

export default Auth;
