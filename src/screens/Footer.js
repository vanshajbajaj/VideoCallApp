import React from 'react';
import "./../css/Footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div id='ftdiv'>

            <div className='ftside'>
                <Link className='ftlink' to="https://leetcode.com/vanshajbajaj/"><i className="flinks zmdi zmdi-code"></i></Link>
                <Link className='ftlink' to="https://github.com/vanshajbajaj"><i className="flinks zmdi zmdi-github"></i></Link>
                <Link className='ftlink' to='https://www.linkedin.com/in/vanshaj-b-2bb3b4120/'><i className="flinks zmdi zmdi-linkedin-box"></i></Link>

            </div>
            <div id='ftmid'>



            </div>
            <div className='ftside2'>
                <i className=" flinks zmdi zmdi-mood"></i> Made By Vanshaj Bajaj
            </div>

        </div>
    )
}

export default Footer