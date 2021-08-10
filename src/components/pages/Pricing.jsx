import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getAllClasses } from '../../api/index';

function Pricing() {
	const [classes, setClasses] = useState([]);
	const loadClasses = () =>
		getAllClasses().then((data) => setClasses([...data]));

	useEffect(() => {
		loadClasses();
	}, []);
	return (
		<div className='page-container'>
			<Navbar />
			<div className='page-content py-0 pl-3 pr-2' id='invoices-container-id'>
				<div className='main-wrapper pricing-container'>
					<div className='d-flex justify-content-center my-xl-4 my-sm-2'>
						<span>Jour</span>
					</div>
					<div className='row'>
						{classes
							.filter((item) => item.session === 'day')
							.map((classe, index) => (
								<div className='col-lg-4' key={index}>
									<div className='card mb-5 mb-lg-0 border-0 shadow'>
										<div className='card-body'>
											<h2 className='card-heading text-success text-center fw-bold py-3 text-capitalize'>
												{classe.class_name}
											</h2>
											<p className='text-muted text-center mb-4'>
												<span className='h1 text-dark fw-bold'>
													${classe.price}
												</span>
												<span className='ms-2'>/ Adulte</span>
											</p>
											<hr className='text-muted'></hr>
											<ul className='fa-ul my-4'>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Prix pour Enfant:{' '}
													<span className='font-weight-bold'>
														${classe.kids_price}
													</span>{' '}
													/ enfant
												</li>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Bagage: <span className='font-weight-bold'>5Kg</span>
												</li>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Unlimited Public Projects
												</li>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Community Access
												</li>
											</ul>
										</div>
									</div>
								</div>
							))}
					</div>

					<div className='d-flex justify-content-center my-4'>
						<span>Nuit</span>
					</div>

					<div className='row'>
						{classes
							.filter((item) => item.session === 'night')
							.map((classe, index) => (
								<div className='col-lg-4' key={index}>
									<div className='card mb-5 mb-lg-0 border-0 shadow'>
										<div className='card-body'>
											<h2 className='card-heading text-success text-center fw-bold py-3 text-capitalize'>
												{classe.class_name}
											</h2>
											<p className='text-muted text-center mb-4'>
												<span className='h1 text-dark fw-bold'>
													${classe.price}
												</span>
												<span className='ms-2'>/ Adulte</span>
											</p>
											<hr className='text-muted'></hr>
											<ul className='fa-ul my-4'>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Prix pour Enfant:{' '}
													<span className='font-weight-bold'>
														${classe.kids_price}
													</span>
												</li>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													5GB Storage
												</li>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Unlimited Public Projects
												</li>
												<li className='mb-3'>
													<span className='fa-li text-success'>
														<i className='fas fa-check'></i>
													</span>
													Community Access
												</li>
											</ul>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Pricing;
