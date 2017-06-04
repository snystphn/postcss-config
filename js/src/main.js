import React from 'react';
import { render } from 'react-dom';
import Slider from 'rc-range-slider';


export default render(
		<Slider value={[ 20, 75 ]} 
					   onChange={ ( e ) => alert( e.value )}
					   tipFormatter={ value => `${value}` } 
					   color='blue'
					   minRange={ 0 }
					   min={ 1 } 
					   max={ 100 } />,
		document.getElementById( 'app' ));