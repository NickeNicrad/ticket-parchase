import React from 'react';

function Footer() {
	return (
		<div className='page-footer' id='page-footer-id'>
			<div className='row'>
				<div className='col-md-12'>
					<span className='footer-text'>
						Copyright &copy; {new Date().getFullYear()} All Rights Reserved
					</span>
				</div>
			</div>
		</div>
	);
}

export default Footer;
