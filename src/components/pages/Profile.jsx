import React, { useState, useEffect } from 'react';
import CleavePhone from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.cd';
import Footer from '../Footer';
import profile2 from '../../images/avatars/profile-image-2.png';
import Navbar from '../Navbar';
import { getProfile, updateUser, updatePassword } from '../../api/index';

function Profile() {
	window.document.body.classList.add('app-profile');
	const [msgResponse, setMsgResponse] = useState({ success: '', failed: '' });
	const [password, setPassword] = useState({
		currentpassword: '',
		newpassword: '',
		confirmpassword: '',
	});

	const [values, setValues] = useState({
		id: '',
		fname: '',
		lname: '',
		email: '',
		phone: '',
		address: '',
		about: '',
	});

	const loadProfile = () =>
		getProfile()
			.then((res) => {
				return setValues(res.data);
			})
			.catch((err) => {
				if (err.response.data) {
					console.log(err.response.data);
				}
			});

	const handleUserUpdate = (e) => {
		e.preventDefault();
		const { id } = values;
		updateUser(id, values)
			.then((res) => {
				alert(res.data && res.data);
				loadProfile();
			})
			.catch((err) => console.log(err.response));
	};

	const handlePasswords = (e) => {
		e.preventDefault();
		const { id } = values;
		updatePassword(id, password)
			.then((res) => {
				setMsgResponse({ success: res.data });
			})
			.catch((err) => {
				if (err.response) return setMsgResponse({ failed: err.response.data });
				setMsgResponse({ failed: 'veillez verifiez le serveur' });
			});
	};

	useEffect(() => {
		// loadMessages();
		loadProfile();
	}, []);

	return (
		<div className='page-container'>
			<Navbar />
			<div className='page-content'>
				<div className='main-wrapper'>
					<div className='profile-header'>
						<div className='row'>
							<div className='col'>
								<div className='profile-img'>
									<img src={profile2} alt='' />
								</div>
								<div className='profile-name'>
									<h2 className='text-capitalize'>
										{`${values && values.fname} ${values && values.lname}`}
									</h2>
									<h6 className='text-muted'>{values && values.email}</h6>
								</div>
								<div className='profile-menu'>
									<ul></ul>
									<div className='profile-status'>
										<i className='active-now' />{' '}
										{navigator.onLine === true ? 'enligne' : 'hors ligne'}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='profile-content'>
						<div className='row'>
							<div className='col-lg-8'>
								<form onSubmit={handleUserUpdate}>
									<div className='row'>
										<div className='col-md'>
											<div className='form-group'>
												<input
													className='form-control'
													type='text'
													placeholder='Nom'
													value={values.fname}
													onChange={(e) =>
														setValues({ ...values, fname: e.target.value })
													}
												/>
											</div>

											<div className='form-group'>
												<input
													className='form-control'
													type='text'
													placeholder='Post-Nom'
													value={values.lname}
													onChange={(e) =>
														setValues({ ...values, lname: e.target.value })
													}
												/>
											</div>

											<div className='form-group'>
												<input
													className='form-control'
													type='text'
													placeholder='Address Electronique'
													value={values.email}
													onChange={(e) =>
														setValues({ ...values, email: e.target.value })
													}
												/>
											</div>

											<div className='form-group'>
												<button
													type='button'
													className='btn btn-secondary'
													data-toggle='modal'
													data-target='#passwordModal'>
													Modifier le mot de passe
												</button>
											</div>
										</div>
										<div className='col-md'>
											<div className='form-group'>
												<CleavePhone
													className='form-control'
													options={{
														phone: true,
														phoneRegionCode: 'CD',
													}}
													placeholder='Téléphone'
													value={values.phone}
													onChange={(e) =>
														setValues({ ...values, phone: e.target.value })
													}
												/>
											</div>

											<div className='form-group'>
												<input
													className='form-control'
													type='text'
													placeholder='Addresse'
													value={values.address}
													onChange={(e) =>
														setValues({ ...values, address: e.target.value })
													}
												/>
											</div>

											<div className='form-group'>
												<textarea
													className='form-control'
													type='text'
													rows='3'
													placeholder='aprops de vous'
													value={values.about}
													onChange={(e) =>
														setValues({ ...values, about: e.target.value })
													}
												/>
											</div>

											<div className='row'>
												<div className='col'>
													<div className='form-group'>
														<button
															type='button'
															className='btn btn-warning btn-block'>
															Annuler
														</button>
													</div>
												</div>
												<div className='col'>
													<div className='form-group'>
														<button
															type='submit'
															className='btn btn-success btn-block'>
															Mettre à jour
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div className='col-lg-4'>
								<div className='card'>
									<div className='card-body'>
										<h5 className='card-title'>Aprops</h5>
										<p>{values.about}</p>
										<ul className='list-unstyled profile-about-list'>
											<li className='text-capitalize'>
												<i className='material-icons'>home</i>
												<span>Addresse: {values.address}</span>
											</li>
											<li>
												<i className='material-icons'>mail_outline</i>
												<span>Email: {values.email}</span>
											</li>

											<li>
												<i className='material-icons'>local_phone</i>
												<span>Téléphone: {values.phone}</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* modal start */}
			<div
				className='modal fade'
				id='passwordModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='passwordModalLabel'
				aria-hidden='true'>
				<div
					className='modal-dialog modal-dialog-centered modal-sm'
					role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='passwordModalLabel'>
								Mise à jour du mot passe
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
								onClick={() => {
									setPassword({
										...password,
										currentpassword: '',
										newpassword: '',
										confirmpassword: '',
									});
									setMsgResponse({
										...msgResponse,
										failed: '',
										success: '',
									});
								}}>
								<i className='material-icons'>close</i>
							</button>
						</div>
						<div className='modal-body'>
							<form onSubmit={handlePasswords}>
								<div className='form-group'>
									<input
										className='form-control'
										type='password'
										placeholder='actuel mot de passe'
										value={password.currentpassword}
										onChange={(e) =>
											setPassword({
												...password,
												currentpassword: e.target.value,
											})
										}
									/>
								</div>

								<div className='form-group'>
									<input
										className='form-control'
										type='password'
										placeholder='nouveau mot de passe'
										value={password.newpassword}
										onChange={(e) =>
											setPassword({
												...password,
												newpassword: e.target.value,
											})
										}
									/>
								</div>

								<div className='form-group'>
									<input
										className='form-control'
										type='password'
										placeholder='confimer mot de passe'
										value={password.confirmpassword}
										onChange={(e) =>
											setPassword({
												...password,
												confirmpassword: e.target.value,
											})
										}
									/>
								</div>

								<div className='row'>
									<div className='form-group col'>
										<button
											type='button'
											className='btn btn-warning btn-block'
											onClick={() => {
												setPassword({
													...password,
													currentpassword: '',
													newpassword: '',
													confirmpassword: '',
												});
												setMsgResponse({
													...msgResponse,
													failed: '',
													success: '',
												});
											}}>
											Annuler
										</button>
									</div>

									<div className='form-group col'>
										<button type='submit' className='btn btn-success btn-block'>
											valider
										</button>
									</div>
								</div>
							</form>
							<div className='text-center pb-3'>
								{msgResponse.failed ? (
									<small className='text-warning border rounded p-1'>
										{msgResponse.failed}
									</small>
								) : (
									<small className='text-success border rounded p-1'>
										{msgResponse.success}
									</small>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* modal end */}
			<Footer />
		</div>
	);
}

export default Profile;
