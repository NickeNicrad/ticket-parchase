import React, { useState, useEffect } from 'react';
import { login, getProfile } from '../../api';

function Login() {
	const [values, setValues] = useState({
		email: '',
		password: '',
		error: '',
	});
	const handleUser = (e) => {
		e.preventDefault();
		login(values)
			.then((res) => {
				localStorage.setItem('token', JSON.stringify(res.data.token));
				localStorage.setItem('user_id', JSON.stringify(res.data.user.id));
				window.location.href = '/';
			})
			.catch((err) => {
				if (err.response)
					return setValues({ ...values, error: err.response.data });
				setValues({ ...values, error: 'no connection with the server' });
			});
	};

	useEffect(() => {
		getProfile().then((res) => {
			if (res.data) return (window.location.href = '/');
			console.log(res.data);
			window.location.href = '/login';
			localStorage.clear();
		});
	});

	return (
		<div className='auth-page sign-in'>
			<div className='connect-container align-content-stretch d-flex flex-wrap'>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-lg-6 d-none d-lg-block d-xl-block'>
							<div className='auth-image' />
						</div>
						<div className='col-lg-5'>
							<div className='auth-form'>
								<div className='row'>
									<div className='col'>
										<div className='logo-box'>
											<a href className='logo-text'>
												Login
											</a>
										</div>
										<form onSubmit={handleUser}>
											<div className='form-group'>
												<input
													type='email'
													className='form-control'
													id='email'
													aria-describedby='emailHelp'
													placeholder='E-Mail'
													value={values.email}
													onChange={(e) =>
														setValues({ ...values, email: e.target.value })
													}
												/>
											</div>
											<div className='form-group'>
												<input
													type='password'
													className='form-control'
													id='password'
													placeholder='Password'
													value={values.password}
													onChange={(e) =>
														setValues({ ...values, password: e.target.value })
													}
												/>
											</div>
											<button
												type='submit'
												className='btn btn-primary btn-block btn-submit'>
												Sign In
											</button>
										</form>
									</div>
								</div>
								<div className='col-lg-12 mt-2'>
									<div className='card'>
										{values.error ? (
											<div
												id='error-msg-id'
												className='alert alert-warning no-m text-center'
												role='alert'>
												{values.error}
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
