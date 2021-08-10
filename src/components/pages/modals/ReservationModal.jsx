import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import QRCode from 'qrcode';
import {
	createInvoice,
	getAllBoats,
	getDailyProgram,
	getAllClasses,
} from '../../../api';
import PrintInvoiceModal from './PrintInvoiceModal';

function ReservationModal(props) {
	dayjs.extend(relativeTime);
	const [user_id] = useState(JSON.parse(localStorage.getItem('user_id')));
	const [boats, setBoat] = useState([]);
	const [classes, setClasses] = useState([]);
	const [program, setProgram] = useState([]);
	const [invoicePrint, setInvoicePrint] = useState({});
	const [imageUrl, setImageUrl] = useState();

	const [values, setValues] = useState({
		boat_name: '',
		classe_name: ''.trim(),
		destination: '-'.trim(),
		departure_time: ''.trim(),
		arriving_time: ''.trim(),
		for_kids: false,
		error: ''.trim(),
	});

	const printInvoice = () => {
		const pageToPrint = document.querySelector('#bg-image-id').innerHTML;
		const body = document.body.innerHTML;
		document.body.innerHTML = pageToPrint;
		window.print();
		document.body.innerHTML = body;
		window.location.reload();
	};

	const createNewInvoice = (e) => {
		e.preventDefault();

		if (
			filteredProgram.departure_time < '17:00' &&
			filteredProgram.departure_time > '05:00'
		) {
			createInvoice({
				user_id,
				...filteredProgram,
				...values,
				...props,
				session: 'day',
				client_id: props.id,
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
				client_id: props.id,
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

	const generateQRCode = (invoice) => {
		const { verification_code } = invoice;
		QRCode.toDataURL(`${verification_code}`, (err, imageUrl) => {
			setImageUrl(imageUrl);
			console.log(err);
		});
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

	const date = dayjs(new Date().toISOString()).format('YYYY-MM-DD');

	const filteredProgram = program
		.filter((boat) => boat.date === date && boat.boat_name === values.boat_name)
		.shift();

	useEffect(() => {
		loadBoats();
		loadClasses();
		loadProgram();
	}, []);

	return (
		<div
			className='modal fade'
			id='reservationModal'
			tabIndex='-1'
			role='dialog'
			aria-labelledby='reservationModalLabel'
			aria-hidden='true'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='reservationModalLabel'>
							Reservation de Billet
						</h5>
						<button
							type='button'
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
									<select className='form-control' onChange={() => loadProgram}>
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
												{filteredProgram && filteredProgram.departure_time}
											</span>
										</div>
										<div className='col form-group'>
											<span className='ml-3'>heure d'arriver</span>
											<span className='form-control'>
												{filteredProgram && filteredProgram.arriving_time}
											</span>
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
											disabled={values.classe_name === ''}>
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
			<PrintInvoiceModal {...invoicePrint} imageUrl={imageUrl} />
		</div>
	);
}

export default ReservationModal;
