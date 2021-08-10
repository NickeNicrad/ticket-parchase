import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
	createInvoice,
	getAllBoats,
	getDailyProgram,
	getAllClasses,
} from '../../../api';
import logo from '../../../images/logo.png';

function ChildReservationModal(props) {
	dayjs.extend(relativeTime);
	const [user_id] = useState(JSON.parse(localStorage.getItem('user_id')));
	const [boats, setBoat] = useState([]);
	const [classes, setClasses] = useState([]);
	const [program, setProgram] = useState([]);
	const [imageUrl, setImageUrl] = useState();
	const [invoicePrint, setInvoicePrint] = useState({});

	const [values, setValues] = useState({
		boat_name: '',
		classe_name: ''.trim(),
		destination: '-'.trim(),
		departure_time: ''.trim(),
		arriving_time: ''.trim(),
		for_kids: undefined,
		error: ''.trim(),
	});

	const createNewInvoice = (e) => {
		e.preventDefault();

		if (
			filteredProgram.departure_time < '15:00' &&
			filteredProgram.departure_time > '05:00'
		) {
			createInvoice({
				user_id,
				...filteredProgram,
				...values,
				...props,
				session: 'day',
			})
				.then((res) => {
					if (res.data) {
						setInvoicePrint({ ...res.data.invoice });
						generateQRCode({ ...res.data.invoice });
					}
				})
				.then(() => printInvoice())
				.catch((err) => {
					if (err) throw alert(err.response.data);
				});
		} else {
			createInvoice({
				user_id,
				...filteredProgram,
				...values,
				...props,
				session: 'night',
			})
				.then((res) => {
					if (res.data) {
						setInvoicePrint({ ...res.data.invoice });
						generateQRCode({ ...res.data.invoice });
					}
				})
				.then(() => printInvoice())
				.catch((err) => {
					if (err) throw alert(err.response.data);
				});
		}
	};

	const loadProgram = () =>
		getDailyProgram().then((res) => setProgram([...res.data]));

	const loadBoats = () =>
		getAllBoats().then(async (data) => {
			if (data.error) {
				await alert(data.error);
			} else {
				await setBoat([...data]);
			}
		});

	const loadClasses = () =>
		getAllClasses().then(async (data) => {
			if (data.error) {
				await alert(data.error);
			} else {
				await setClasses([...data]);
			}
		});

	const generateQRCode = (invoice) => {
		const { verification_code } = invoice;
		QRCode.toDataURL(`${verification_code}`, (err, imageUrl) => {
			setImageUrl(imageUrl);
			console.log(err);
		});
	};

	const date = dayjs(new Date().toISOString()).format('YYYY-MM-DD');

	const filteredProgram = program
		.filter((boat) => boat.date === date && boat.boat_name === values.boat_name)
		.shift();

	const printInvoice = () => {
		const pageToPrint = document.querySelector('#bg-img-id').innerHTML;
		const body = document.body.innerHTML;
		document.body.innerHTML = pageToPrint;
		window.print();
		document.body.innerHTML = body;
		window.location.reload();
	};

	useEffect(() => {
		loadBoats();
		loadClasses();
		loadProgram();
	}, []);

	return (
		<div
			className='modal fade'
			id='childReservationModal'
			tabIndex='-1'
			role='dialog'
			aria-labelledby='childReservationModalLabel'
			aria-hidden='true'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='childReservationModalLabel'>
							Reservation de Billet
						</h5>
						<button
							type='button'
							className='close'
							data-dismiss='modal'
							aria-label='Close'>
							<i className='material-icons'>close</i>
						</button>
					</div>
					<div className='modal-body'>
						<div className='mb-5 text-center'>
							<h2>Ets. BMB</h2>
						</div>
						<div className='mb-4'>
							<ul>
								<li>
									N° Carte d'Identité:{' '}
									<span className='font-weight-bold'>
										{props && props.card_id}
									</span>
								</li>
								<li>
									Nom:{' '}
									<span className='font-weight-bold text-capitalize'>
										{props && props.fname}
									</span>
								</li>
								<li>
									Post-Nom:{' '}
									<span className='font-weight-bold text-capitalize'>
										{props && props.lname}
									</span>
								</li>
								<li>
									Numéro de Téléphone:{' '}
									<span className='font-weight-bold'>
										{props && props.phone}
									</span>
								</li>
							</ul>
						</div>
						<form>
							<div className='form-row'>
								<div
									className='col form-group boat-form'
									onChange={(e) =>
										setValues({
											...values.boat_name,
											boat_name: e.target.value,
										})
									}>
									<select className='form-control'>
										<option disabled selected>
											Selectionez le Bateau
										</option>
										{boats.map((boat, index) => (
											<option key={index}>{boat.boat_name}</option>
										))}
									</select>
								</div>
								<div className='col form-group'>
									<select
										className='form-control'
										onChange={(e) =>
											setValues({ ...values, classe_name: e.target.value })
										}>
										<option disabled selected>
											Selectionnez la Classe
										</option>
										{classes
											.filter(
												(item, index, self) =>
													index ===
													self.findIndex(
														(cl) => cl.class_name === item.class_name
													)
											)
											.map((cls, index) => (
												<option key={index}>{cls.class_name}</option>
											))}
									</select>
								</div>
							</div>

							{filteredProgram && filteredProgram ? (
								<div className='invoice-form'>
									<div className='form-row'>
										<div className='col form-group'>
											<span className='ml-3'>départ de:</span>
											<span className='form-control'>
												{filteredProgram.destination &&
													filteredProgram.destination.split(' ')[0]}
											</span>
										</div>
										<div className='col form-group'>
											<span className='ml-3'>à déstination de:</span>
											<span className='form-control'>
												{filteredProgram.destination &&
													filteredProgram.destination.split(' ')[2]}
											</span>
										</div>
									</div>

									<div className='form-row'>
										<div className='col form-group'>
											<span className='ml-3'>heure de départ</span>
											<span className='form-control'>
												{filteredProgram && filteredProgram.departure_time} -{' '}
												{filteredProgram && filteredProgram.arriving_time}
											</span>
										</div>
										<div className='col form-group'>
											<span className='ml-3'>Age</span>
											<select
												className='form-control'
												onChange={(e) =>
													setValues({ ...values, for_kids: e.target.value })
												}>
												<option disabled selected>
													Selectionnez l'Age
												</option>
												<option value={true}>Moins de 10ans</option>
												<option value={false}>10ans et plus</option>
											</select>
										</div>
									</div>

									<div className='modal-footer'>
										<button
											className='btn btn-secondary'
											data-toggle='tooltip'
											title='imprimer'
											data-placement='bottom'
											type='submit'
											onClick={createNewInvoice}
											disabled={
												values.classe_name === '' ||
												values.for_kids === undefined
											}>
											Imprimer
										</button>
									</div>
								</div>
							) : (
								<div className='text-center m-4'>
									<span id='warning-msg'>{values.error}</span>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>

			{/* modal start */}

			<div className='invoice-container'>
				<div className='modal-body' id='bg-img-id'>
					<div className='mb-6'>
						<div className='d-flex justify-content-between align-items-center mb-4'>
							<div>
								<img src={logo} alt='' width='50' height='50' />
							</div>
							<div>
								<h4>Ets. BMB</h4>
							</div>
							<div>
								<small>Ticket N°: {invoicePrint.id}</small>
							</div>
						</div>

						<div className='d-flex justify-content-between'>
							<div>
								<ul className='p-0'>
									<li>
										N° Identité:{' '}
										<span className='font-weight-bold'>
											{invoicePrint && invoicePrint.card_id}
										</span>
									</li>
									<li>
										Nom:{' '}
										<span className='font-weight-bold text-capitalize'>
											{invoicePrint && invoicePrint.fname}{' '}
											{invoicePrint && invoicePrint.lname}
										</span>
									</li>
									<li>
										Téléphone:{' '}
										<span className='font-weight-bold'>
											{invoicePrint && invoicePrint.phone}
										</span>
									</li>
								</ul>
							</div>
							{invoicePrint && invoicePrint.for_kids === true ? (
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
										{invoicePrint && invoicePrint.boat_name}
									</span>
								</li>
								<li>
									Classe:{' '}
									<span className='font-weight-bold'>
										{invoicePrint && invoicePrint.class_name}
									</span>
								</li>
								<li>
									départ de:{' '}
									<span className='font-weight-bold'>
										{invoicePrint.destination &&
											invoicePrint.destination.split(' ')[0]}
									</span>
								</li>
								<li>
									destination:{' '}
									<span className='font-weight-bold'>
										{invoicePrint.destination &&
											invoicePrint.destination.split(' ')[2]}
									</span>
								</li>
								<li className='d-flex'>
									date et heure:{' '}
									<span className='mx-2 font-weight-bold'>
										{invoicePrint &&
											dayjs(invoicePrint.date).format('DD/MM/YYYY')}
									</span>
									à
									<span className='mx-2 font-weight-bold'>
										{invoicePrint && invoicePrint.departure_time}
									</span>
								</li>
							</ul>
							<div className='d-flex justify-content-around'></div>
							<hr />
							<div>
								Prix du Billet:{' '}
								<span className='font-weight-bold'>
									{invoicePrint && invoicePrint.price}$
								</span>
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

							<div className='d-flex justify-content-center'>
								<img width='150' height='150' src={imageUrl} alt='' />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* modal end */}
		</div>
	);
}

export default ChildReservationModal;
