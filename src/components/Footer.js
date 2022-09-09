import React from "react";
import '../styles/Footer.scss'

const Footer = () => {
    return (
        <footer>
            <div className='footer-container'>
                <ul className='language-list'>
                    <li id='selected-lang'>English (UK)</li>
                    <li>Polski</li>
                    <li>Español</li>
                    <li>Français</li>
                    <li>Italiano</li>
                    <li>Lietuvių</li>
                    <li>Română</li>
                    <li>中文</li>
                    <li>Português</li>
                    <li>Deutsch</li>
                </ul>
                <ul className='pageFooterLinkList'>
                    <a href='/sign-up'><li>Sign Up</li></a>
                    <a href='/'><li>Log In</li></a>
                    <a href='https://github.com/Mikadev1996'><li>Mika's GitHub</li></a>
                    <a href='/home'><li>Home</li></a>
                </ul>
                <ul>
                    <li>Mika © 2022</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;