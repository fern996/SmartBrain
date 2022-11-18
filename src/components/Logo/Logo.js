import React from 'react'
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'

const Logo = () =>{
	return (
		<div className="ma4 mt0">
			<Tilt tiltReverse={true} className="Tilt br2 shadow-2" style={{ height:100,width:100 }}>
				<div className="pa3">
					<img style={{paddingTop:'1px'}} src={brain} alt='logo'/>
				</div>
			</Tilt>
		</div>
		);
}

export default Logo;