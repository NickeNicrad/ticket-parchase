import React, { useState, useEffect } from 'react';
import {
	getProfile,
	getAllChats,
	getAllNotifications,
	updateNotification,
} from '../api/index';
import logo from '../images/logo.png';
import profile2 from '../images/avatars/profile-image-2.png';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

function Navbar() {
	dayjs.extend(relativeTime);
	const [auth] = useState(JSON.parse(localStorage.getItem('token')));
	const [data, setData] = useState();
	const [msg, setMsg] = useState([]);
	const [notifications, setNotifications] = useState([]);

	const logout = () => {
		localStorage.clear();
		window.location.href = '/login';
	};

	const updateSMSNotification = (notif) => {
		updateNotification(notif)
			.then((res) => {
				loadNotifications();
				alert(res.data);
			})
			.catch((err) => {
				if (err.response) throw alert(err.response.data);
			});
	};

	const loadNotifications = () =>
		getAllNotifications().then((data) =>
			setNotifications([...data.notification])
		);

	const loadMessages = () => getAllChats().then((res) => setMsg([...res.data]));

	const filteredMessages = msg.filter((msg) => data && msg.uid2 === data.id);
	useEffect(() => {
		loadMessages();
		loadNotifications();
		getProfile()
			.then((res) => {
				return setData(res.data);
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response && err.response.data);
					window.location.href = '/login';
					localStorage.clear();
				} else {
					window.location.href = '/login';
					localStorage.clear();
				}
			});
		if (!auth) return (window.location.href = '/login');
	}, [auth]);

	return (
		<div className='page-header'>
			<nav className='navbar navbar-expand d-flex justify-content-between align-items-center'>
				<div>
					<button
						className='navbar-toggler'
						type='button'
						data-toggle='collapse'
						data-target='#navbarNav'
						aria-controls='navbarNav'
						aria-expanded='false'
						aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon' />
					</button>
					<ul className='navbar-nav'>
						<li className='nav-item small-screens-sidebar-link'>
							<a href className='nav-link'>
								<i className='material-icons-outlined'>menu</i>
							</a>
						</li>

						<li className='nav-item'>
							<a href className='nav-link' id='dark-theme-toggle'>
								<i className='material-icons-outlined'>toggle_off</i>
								<i className='material-icons'>toggle_on</i> Dark Mode
							</a>
						</li>
						<li className='nav-item'>
							<img width='30' height='30' src={logo} alt='' />
						</li>
					</ul>
				</div>

				<div className='d-block d-lg-none'>
					<ul className='navbar-nav d-flex align-items-center'>
						<li className='nav-item'>
							<span className='text-capitalize font-weight-bold'>{`${
								data && data.fname.substr(0, 1)
							}. ${data && data.lname}`}</span>
						</li>
						<li className='nav-item nav-profile dropdown'>
							<a
								href
								className='nav-link dropdown-toggle'
								id='navbarDropdown'
								role='button'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'>
								<img src={profile2} alt='' />

								<i className='material-icons dropdown-icon'>
									keyboard_arrow_down
								</i>
							</a>
							<div className='dropdown-menu' aria-labelledby='navbarDropdown'>
								<span className='dropdown-item text-capitalize text-primary font-weight-bold'>{`${
									data && data.fname
								} ${data && data.lname}`}</span>
								<a className='dropdown-item' href='/messages'>
									messages
									<span className='badge badge-pill badge-info float-right'>
										{filteredMessages.length}
									</span>
								</a>
								<a className='dropdown-item' href='/profile'>
									Settings &amp; Privacy
								</a>
								<div className='dropdown-divider' />
								<a href className='dropdown-item' onClick={logout}>
									Logout
								</a>
							</div>
						</li>
					</ul>
				</div>

				<div className='collapse navbar-collapse' id='navbarNav'>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<a href='/messages' className='nav-link'>
								<i className='material-icons-outlined'>mail</i>
							</a>
						</li>
						<li className='nav-item dropdown'>
							<a
								href
								className='nav-link dropdown-toggle'
								id='navbarDropdown'
								role='button'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'>
								<i className='material-icons-outlined'>notifications</i>
							</a>
							<div
								className='dropdown-menu'
								id='notification-container'
								aria-labelledby='navbarDropdown'>
								<div className='d-flex justify-content-between px-4 mb-2'>
									<strong className='text-primary'>Notifications</strong>
									<button type='button' className='ml-2 mb-1 close'>
										&times;
									</button>
								</div>
								{notifications.length > 0 ? (
									notifications
										.sort(
											(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
										)
										.map((notif, index) => (
											<div className='dropdown-item' key={index}>
												<div className='dropdown-item-header d-flex mb-2'>
													<i className='material-icons-outlined text-info display-4'>
														{notif.title === 'bonus'
															? 'notifications_active'
															: 'admin_panel_settings'}
													</i>
													<div className='ml-2 w-100'>
														<strong className='font-weight-bold text-capitalize text-muted'>
															{notif.username}
														</strong>
														<div className='dropdown-item-body text-wrap text-dark'>
															{notif.content}
														</div>
														<div className='d-flex align-items-center justify-content-between'>
															<small className='text-muted'>
																{notif.updatedAt &&
																	dayjs(notif.updatedAt).fromNow()}
															</small>

															<button
																className='btn btn-xs material-icons py-0 px-1 hover-overlay text-muted'
																onClick={updateSMSNotification.bind(
																	this,
																	notif
																)}>
																{notif.isSent ? 'done' : 'refresh'}
															</button>
														</div>
													</div>
												</div>
											</div>
										))
								) : (
									<div className='text-center text-muted'>
										aucune notification
									</div>
								)}
							</div>
						</li>
						<li className='nav-item nav-profile dropdown'>
							<a
								href
								className='nav-link dropdown-toggle'
								id='navbarDropdown'
								role='button'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'>
								<img src={profile2} alt='' />
								<span className='text-capitalize'>{`${data && data.fname} ${
									data && data.lname
								}`}</span>
								<i className='material-icons dropdown-icon'>
									keyboard_arrow_down
								</i>
							</a>
							<div className='dropdown-menu' aria-labelledby='navbarDropdown'>
								<a className='dropdown-item' href='/messages'>
									messages
									<span className='badge badge-pill badge-info float-right'>
										{filteredMessages && filteredMessages.length}
									</span>
								</a>
								<a className='dropdown-item' href='/profile'>
									Settings &amp; Privacy
								</a>
								<div className='dropdown-divider' />
								<a href className='dropdown-item' onClick={logout}>
									Logout
								</a>
							</div>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	);
}

export default Navbar;
