import React, { useState } from 'react';

function Sidebar() {
	const [auth] = useState(JSON.parse(localStorage.getItem('token')));
	return (
		<>
			{auth ? (
				<div className='page-sidebar'>
					<div className='logo-box'>
						<a href='/' className='logo-text'>
							ETS. BMB
						</a>
						<a href='#' id='sidebar-close'>
							<i className='material-icons'>close</i>
						</a>{' '}
						<a href='#' id='sidebar-state'>
							<i className='material-icons'>chevron_left</i>
							<i className='material-icons compact-sidebar-icon'>
								chevron_right
							</i>
						</a>
					</div>
					<div className='page-sidebar-inner slimscroll'>
						<ul className='accordion-menu'>
							<li className='activ-page'>
								<a href='/' className='active'>
									<i className='material-icons-outlined'>home</i>Home
								</a>
							</li>
							<li>
								<a href='/invoices'>
									<i className='material-icons-outlined'>history</i>
									Historique
								</a>
							</li>
							<li>
								<a href='/pricing'>
									<i className='material-icons-outlined'>payments</i>
									Paiement
								</a>
							</li>
							<li>
								<a href='/messages'>
									<i className='material-icons-outlined'>mail</i>Message
								</a>
							</li>
							<li>
								<a href='/profile'>
									<i className='material-icons-outlined'>account_circle</i>
									Profile
								</a>
							</li>
						</ul>
					</div>
				</div>
			) : null}
		</>
	);
}

export default Sidebar;
