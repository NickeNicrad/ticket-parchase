import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import logo from '../../../images/logo.png';
import {
	bonusCodeVerification,
	updateBonus,
	getDailyProgram,
	getAllBoats,
} from '../../../api/index.js';

function BonusModal() {
	dayjs.extend(relativeTime);
	const [boats, setBoat] = useState([]);
	const [program, setProgram] = useState([]);
	const [values, setValues] = useState({
		boat_name: '',
		verification_code: '',
	});

	const [bonus, setBonus] = useState({
		data: '',
		error: '',
	});

	const printInvoice = () => {
		const pageToPrint = document.querySelector('#bg-bonus-id').innerHTML;
		const body = document.body.innerHTML;
		document.body.innerHTML = pageToPrint;
		window.print();
		document.body.innerHTML = body;
		window.location.reload();
	};

	const handleVerificationCode = (e) => {
		e.preventDefault();
		bonusCodeVerification(values)
			.then((res) => {
				setBonus({ ...bonus, data: res.data });
			})
			.catch((err) => setBonus({ ...bonus, error: err.response.data }));
	};

	const printBonusInvoice = () => {
		const { id } = bonus.data;

		const date = dayjs(new Date().toISOString()).format('YYYY-MM-DD');
		const filteredProgram = program
			.filter(
				(boat) => boat.date === date && boat.boat_name === values.boat_name
			)
			.shift();

		updateBonus(id, {
			...values,
			...bonus.data,
			...filteredProgram,
		}).then((res) => {
			console.log(res.data);
			printInvoice();
		});
	};

	const loadProgram = () => {
		getDailyProgram()
			.then((res) => {
				setProgram([...res.data]);
			})
			.catch((err) => {
				if (err.response) return console.log(err.response.data);
				console.log(err.response.data);
			});
	};

	const loadBoats = () => {
		getAllBoats()
			.then(async (data) => {
				if (data.error) {
					await alert(data.error);
				} else {
					await setBoat([...data]);
				}
			})
			.catch((err) => {
				if (err.response) return console.log(err.response.data);
				console.log(err.response.data);
			});
	};

	const date = dayjs(new Date().toISOString()).format('YYYY-MM-DD');
	const filteredProgram = program
		.filter((boat) => boat.date === date && boat.boat_name === values.boat_name)
		.shift();

	useEffect(() => {
		loadProgram();
		loadBoats();
	}, []);

	return (
		<div
			className='modal fade'
			id='bonusModal'
			tabIndex='-1'
			role='dialog'
			aria-labelledby='bonusModalLabel'
			aria-hidden='true'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='reservationModalLabel'>
							Billet Bonus
						</h5>
						<button
							type='reset'
							className='close'
							data-dismiss='modal'
							aria-label='Close'
							onClick={() => window.location.reload()}>
							<i className='material-icons'>close</i>
						</button>
					</div>
					<div className='modal-body'>
						<div className='mb-5 text-center'>
							<h2>Ets. BMB</h2>
						</div>

						<div>
							<form onSubmit={handleVerificationCode}>
								<div className='form-group'>
									<input
										type='number'
										className='form-control'
										placeholder='Entrez le Code de Vérification'
										onChange={(e) =>
											setValues({
												...values,
												verification_code: e.target.value,
											})
										}
									/>
								</div>
								<div className='form-group text-center'>
									<button
										type='submit'
										className='btn btn-secondary'
										disabled={!values.verification_code}>
										Vérifier le Code
									</button>
								</div>
							</form>
						</div>

						{bonus.data && bonus.data ? (
							<>
								<div className='mb-4'>
									<ul>
										<li>
											N° Carte d'Identité:{' '}
											<span className='font-weight-bold'>
												{bonus.data.card_id}
											</span>
										</li>
										<li>
											Nom:{' '}
											<span className='font-weight-bold text-capitalize'>
												{bonus.data.fname}
											</span>
										</li>
										<li>
											Post-Nom:{' '}
											<span className='font-weight-bold text-capitalize'>
												{bonus.data.lname}
											</span>
										</li>
										<li>
											Numéro de Téléphone:{' '}
											<span className='font-weight-bold'>
												{bonus.data.phone}
											</span>
										</li>
									</ul>
								</div>
								<form>
									<div className='form-row'>
										<div
											className='col form-group'
											onChange={(e) => {
												loadProgram();
												setValues({ ...values, boat_name: e.target.value });
											}}>
											<select className='form-control'>
												<option disabled selected>
													Selectionez le Bateau
												</option>
												{boats.map((boat, index) => (
													<option key={index}>{boat && boat.boat_name}</option>
												))}
											</select>
										</div>
										<div className='col form-group'>
											<span className='form-control'>
												{bonus.data && bonus.data.class_name}
											</span>
										</div>
									</div>
									{filteredProgram ? (
										<div className='bonus-form'>
											<div className='form-row'>
												<div className='col form-group'>
													<span className='ml-3'>départ de:</span>
													<span className='form-control'>
														{filteredProgram &&
															filteredProgram.destination.split(' ')[0]}
													</span>
												</div>
												<div className='col form-group'>
													<span className='ml-3'>déstination:</span>
													<span className='form-control'>
														{filteredProgram &&
															filteredProgram.destination.split(' ')[2]}
													</span>
												</div>
											</div>

											<div className='form-row'>
												<div className='col form-group'>
													<span className='ml-3'>heure de départ</span>
													<span className='form-control'>
														{filteredProgram && filteredProgram.departure_time}
													</span>
												</div>
												<div className='col form-group'>
													<span className='ml-3'>heure d'arrivée</span>
													<span className='form-control'>
														{filteredProgram && filteredProgram.arriving_time}
													</span>
												</div>
											</div>

											<div className='modal-footer'>
												<button
													type='button'
													className='btn btn-secondary'
													onClick={printBonusInvoice}>
													Imprimer
												</button>
											</div>
										</div>
									) : (
										<div className='d-flex justify-content-center mb-2'>
											<h6>aucun programme</h6>
										</div>
									)}
								</form>
							</>
						) : (
							<div className='text-center m-4'>
								<span className='text-center'>{bonus && bonus.error}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* modal start */}
			<div
				className='modal fade'
				id='childPrintModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='childPrintModalLabel'
				aria-hidden='true'>
				<div
					className='modal-dialog modal-dialog-centered modal-xs'
					role='document'>
					<div className='modal-content'>
						<div className='modal-body' id='bg-bonus-id'>
							<div className='mb-6'>
								<div className='d-flex justify-content-between mb-4'>
									<div>
										<img src={logo} alt='' width='50' height='50' />
									</div>
									<div>
										<h2>Ets. BMB</h2>
									</div>
									<div>
										<small>Billet Bonus</small>
									</div>
								</div>

								<div className='d-flex justify-content-between'>
									<div>
										<ul className='p-0'>
											<li>
												N° Identité:{' '}
												<span className='font-weight-bold'>
													{bonus.data && bonus.data.card_id}
												</span>
											</li>
											<li>
												Nom:{' '}
												<span className='font-weight-bold text-capitalize'>
													{bonus.data && bonus.data.fname}{' '}
													{bonus.data && bonus.data.lname}
												</span>
											</li>
											<li>
												Téléphone:{' '}
												<span className='font-weight-bold'>
													{bonus.data && bonus.data.phone}
												</span>
											</li>
										</ul>
									</div>
									{filteredProgram && filteredProgram.for_kids === true ? (
										<div>Enfant</div>
									) : (
										<div>Adulte</div>
									)}
								</div>
								<hr />
								<div>
									<ul className='p-0'>
										<li>
											Bateau:{' '}
											<span className='font-weight-bold'>
												{filteredProgram && filteredProgram.boat_name}
											</span>
										</li>
										<li>
											Classe:{' '}
											<span className='font-weight-bold'>
												{bonus.data && bonus.data.class_name}
											</span>
										</li>
										<li>
											départ de:{' '}
											<span className='font-weight-bold'>
												{filteredProgram &&
													filteredProgram.destination.split(' ')[0]}
											</span>
										</li>
										<li>
											destination:{' '}
											<span className='font-weight-bold'>
												{filteredProgram &&
													filteredProgram.destination.split(' ')[2]}
											</span>
										</li>
										<li className='d-flex'>
											date et heure:{' '}
											<span className='mx-2 font-weight-bold'>
												{filteredProgram &&
													dayjs(filteredProgram.date).format('DD/MM/YYYY')}
											</span>
											à
											<span className='mx-2 font-weight-bold'>
												{filteredProgram && filteredProgram.departure_time}
											</span>
										</li>
									</ul>
									<hr />
									<div>
										Prix du Billet:{' '}
										<span className='font-weight-bold'>Gratuit</span>
									</div>
									<div className='d-flex flex-column align-items-center'>
										<span className='font-weight-bold'>Contacts</span>
										<div className='my-2'>
											<span className='text-sm'>+243 993 685 356</span>
										</div>
									</div>
									<div className='text-center m-4'>
										<span>Bon Voyage!</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* modal end */}
		</div>
	);
}

export default BonusModal;
