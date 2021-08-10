import React, { useState, useEffect } from 'react';
import CleavePhone from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.cd';
import QRCodeReader from 'react-qr-reader';
import {
	createClient,
	deleteClient,
	getAllClients,
	updateClient,
	verifyInvoice,
} from '../../api';

import ReservationModal from './modals/ReservationModal';
import Navbar from '../Navbar';
import Footer from '../Footer';
import BonusModal from './modals/BonusModal';
import SponsorModal from './modals/SponsorModal';

function Home() {
	const [value, setValue] = useState({
		id: ''.trim(),
		card_id: ''.trim(),
		fname: ''.trim(),
		lname: ''.trim(),
		phone: ''.trim(),
		search: ''.trim(),
		initUpdated: false,
		initQRScan: false,
		successMsg: '',
		errorMsg: '',
		data: {},
	});

	const [client, setClient] = useState([]);
	const [error, setError] = useState({ err: '' });
	const [scanQRResult, setQRResult] = useState('');

	const createNewClient = (e) => {
		e.preventDefault();
		createClient(value)
			.then((res) => {
				alert(res.data);
				loadClients();
			})
			.catch((err) => alert(err.data && err.response.data));
		setValue({ ...value, card_id: '', fname: '', lname: '', phone: '' });
	};

	const updateExistingClient = (e) => {
		e.preventDefault();
		updateClient(value).then((res) => {
			loadClients();
			setValue({
				...value,
				card_id: '',
				fname: '',
				lname: '',
				phone: '',
				initUpdated: false,
			});
			alert(res.data);
		});
	};

	const loadClients = () => {
		getAllClients().then(async (data) => {
			if (data.error) {
				await setError({ ...error, err: data.error });
				alert(data.error);
			} else {
				await setClient([...data]);
			}
		});
	};

	const deleteExistingClient = () => {
		if (window.confirm('voulez-vous vraiment supprimer?')) {
			deleteClient(value)
				.then((res) => {
					loadClients();
					setValue({
						...value,
						card_id: '',
						fname: '',
						lname: '',
						phone: '',
						initUpdated: false,
					});
					alert(res.data);
				})
				.catch((err) => console.log(err.response.data));
		}
	};

	const initClient = (data) => {
		const { id, card_id, fname, lname, phone } = data;
		setValue({ ...value, id, card_id, fname, lname, phone, initUpdated: true });
	};

	const handleValues = (data) => {
		setValue({ ...value, data });
	};

	const handleErrorFile = (error) => {
		console.log(error);
	};

	const handleScanFile = (result) => {
		if (result) {
			setQRResult(result);
			const verification_code = parseInt(result);

			verifyInvoice({ verification_code })
				.then((res) => {
					console.log(res.data);
					setValue({ ...value, successMsg: res.data });
				})
				.catch((err) => setValue({ ...value, errorMsg: err.response.data }));
		}
	};

	const onScanQRCode = () => {
		setValue({ ...value, initQRScan: true });
	};

	const filteredClient = client.filter(
		(client_item) =>
			(
				client_item.id +
				' ' +
				client_item.fname +
				' ' +
				client_item.lname +
				' ' +
				client_item.card_id +
				' ' +
				client_item.phone
			)
				.toLowerCase()
				.indexOf(value.search.toLowerCase()) !== -1
	);
	useEffect(() => {
		loadClients();
	}, []);
	return (
		<div className='page-container'>
			<Navbar />
			<div className='page-content'>
				<div className='page-info p-0'>
					<nav aria-label='breadcrumb'>
						<ol className='breadcrumb'>
							<li className='breadcrumb-item'>
								<span>Apps</span>
							</li>
							<li className='breadcrumb-item active' aria-current='page'>
								Home
							</li>
							<li className='d-none d-xl-block'>
								<button
									className='btn btn-secondary btn-sm ml-3'
									data-toggle='modal'
									data-target='#bonusModal'
									id='bonus-modal-id'>
									Vérifier Bonus
								</button>
							</li>
							<li className='d-block d-xl-none'>
								<button
									className='btn btn-secondary btn-xs ml-3 pb-0 pt-2'
									data-toggle='modal'
									data-target='#newClientModal'>
									<i className='material-icons'>
										{value.initUpdated ? 'update' : 'add'}
									</i>
								</button>
							</li>
							<li className='d-block d-xl-none'>
								<button
									className='btn btn-secondary btn-xs ml-3 pb-0 pt-2'
									data-toggle='modal'
									data-target='#bonusModal'
									id='bonus-modal-id'>
									<i className='material-icons'>credit_card</i>
								</button>
							</li>
							<li>
								<button
									className='btn btn-secondary btn-xs ml-3 pb-0 pt-2'
									data-toggle='modal'
									data-target='#scanModal'
									onClick={onScanQRCode}>
									<i className='material-icons'>qr_code_scanner</i>
								</button>
							</li>
						</ol>
					</nav>
					<div className='page-options'>
						<input
							className='form-control'
							type='text'
							placeholder='recherche...'
							value={value.search}
							onChange={(e) => setValue({ ...value, search: e.target.value })}
						/>
					</div>
				</div>
				<div className='main-wrapper client-pg'>
					<div className='row'>
						<div className='col-lg-4 col-sm-12 pl-0 d-none d-xl-block'>
							<div className='card'>
								<div className='card-body'>
									{value.initUpdated ? (
										<h3>Mise à jour du Client</h3>
									) : (
										<h3>Nouveau Client</h3>
									)}
								</div>
							</div>

							<div className='card' id='client-card-id'>
								<div className='card-body'>
									<form
										onSubmit={
											value.initUpdated ? updateExistingClient : createNewClient
										}>
										<div className='form-group'>
											<input
												type='number'
												className='form-control'
												placeholder='Numéro du carte ID'
												value={value.card_id}
												onChange={(e) =>
													setValue({ ...value, card_id: e.target.value })
												}
											/>
										</div>
										<div className='form-group'>
											<input
												type='text'
												className='form-control'
												placeholder='Prénom'
												value={value.fname}
												onChange={(e) =>
													setValue({ ...value, fname: e.target.value })
												}
											/>
										</div>
										<div className='form-group'>
											<input
												type='text'
												className='form-control'
												placeholder='Post-Nom'
												value={value.lname}
												onChange={(e) =>
													setValue({ ...value, lname: e.target.value })
												}
											/>
										</div>
										<div className='form-group'>
											<CleavePhone
												placeholder='Téléphone'
												className='form-control'
												options={{
													phone: true,
													phoneRegionCode: 'CD',
												}}
												value={value.phone}
												onChange={(e) =>
													setValue({ ...value, phone: e.target.value })
												}
											/>
										</div>
										{value.initUpdated ? (
											<>
												<div className='form-group d-flex'>
													<button
														type='button'
														className='btn btn-danger form-control'
														onClick={deleteExistingClient}>
														Supprimer
													</button>
													<button
														type='submit'
														className='btn btn-success form-control ml-2'>
														Mettre à jour
													</button>
												</div>
												<button
													type='reset'
													className='btn btn-warning form-control mr-2'
													onClick={() =>
														setValue({
															...value,
															card_id: '',
															fname: '',
															lname: '',
															phone: '',
															initUpdated: false,
														})
													}>
													Annuler
												</button>
											</>
										) : (
											<button
												type='submit'
												className='btn btn-success w-100 form-control'>
												Ajouter
											</button>
										)}
									</form>
								</div>
							</div>
						</div>
						<div className='col-xl-8 col-lg-12 col-sm-12 px-0'>
							<div className='card card-transactions'>
								<div className='card-body'>
									<h5 className='card-title'>
										List des Clients
										<span
											className='card-title-helper blockui-transactions cursor-pointer'
											onClick={loadClients}>
											<i className='material-icons'>refresh</i>
										</span>
									</h5>
									<div className='table-responsive' id='client-tab-id'>
										<table className='table table-striped'>
											<thead>
												<tr>
													<th scope='col'>#</th>
													<th scope='col'>Numéro ID</th>
													<th scope='col'>Nom & Prénom</th>
													<th scope='col'>Phone</th>
													<th scope='col'>Reservation</th>
												</tr>
											</thead>
											<tbody>
												{filteredClient &&
													filteredClient.map((client_item, index) => {
														return (
															<tr key={client_item.id}>
																<td>{index + 1}</td>
																<td>{client_item.card_id}</td>
																<td
																	className='text-capitalize'
																	onClick={initClient.bind(this, client_item)}>
																	{`${client_item.fname} ${client_item.lname}`}
																</td>
																<td>{client_item.phone}</td>
																<td className='d-flex justify-content-around'>
																	<button
																		className='btn btn-xs action-item text-info'
																		data-toggle='modal'
																		data-target='#reservationModal'
																		onClick={handleValues.bind(
																			this,
																			client_item
																		)}>
																		<i className='material-icons'>event_seat</i>
																	</button>

																	<button
																		className='btn btn-xs action-item text-info'
																		data-toggle='modal'
																		data-target='#sponsorModal'
																		onClick={handleValues.bind(
																			this,
																			client_item
																		)}>
																		<i className='material-icons'>
																			supervisor_account
																		</i>
																	</button>
																</td>
															</tr>
														);
													})}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			<ReservationModal {...value.data} />
			<SponsorModal {...value.data} />
			<BonusModal />

			{value.initQRScan ? (
				<div
					className='modal fade'
					id='scanModal'
					tabIndex='-1'
					role='dialog'
					aria-labelledby='scanModalLabel'
					aria-hidden='true'>
					<div className='modal-dialog modal-sm' role='document'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title' id='scanModalLabel'>
									Scan du Code QR
								</h5>
								<button
									type='button'
									className='close'
									data-dismiss='modal'
									aria-label='Close'
									onClick={() => {
										setValue({
											...value,
											successMsg: '',
											errorMsg: '',
											initQRScan: false,
										});
										setQRResult('');
									}}>
									<i className='material-icons'>close</i>
								</button>
							</div>
							{scanQRResult === '' ? (
								<div className='modal-body'>
									<div className='card'>
										<QRCodeReader
											onError={handleErrorFile}
											onScan={handleScanFile}
											delay={300}
										/>
									</div>
								</div>
							) : (
								<div className='p-4'>
									{value.successMsg ? (
										<div>
											<div className='text-center py-4'>
												<i className='material-icons text-success display-1'>
													done
												</i>
											</div>
											<div className='text-center pt-2'>
												<h6>Code: {scanQRResult}</h6>
												<span>{value && value.successMsg}</span>
											</div>
										</div>
									) : (
										<div>
											<div className='text-center '>
												<i className='material-icons text-danger display-1'>
													close
												</i>
											</div>
											<div className='text-center pt-2'>
												<h6>Code: {scanQRResult}</h6>
												<span>{value && value.errorMsg}</span>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			) : null}

			<div
				className='modal fade'
				id='newClientModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='newClientModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-sm' role='document'>
					<div className='modal-content pb-4'>
						<div className='modal-header'>
							<h5 className='modal-title' id='scanModalLabel'>
								{value.initUpdated ? 'Mise à jour du Client' : 'Nouveau Client'}
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
								onClick={() =>
									setValue({
										...value,
										card_id: '',
										fname: '',
										lname: '',
										phone: '',
										initUpdated: false,
									})
								}>
								<i className='material-icons'>close</i>
							</button>
						</div>
						<div className='modal-body'>
							<form
								onSubmit={
									value.initUpdated ? updateExistingClient : createNewClient
								}>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Card ID: </span>
									<input
										type='number'
										className='form-control w-75'
										placeholder='Numéro du carte ID'
										value={value.card_id}
										onChange={(e) =>
											setValue({ ...value, card_id: e.target.value })
										}
									/>
								</div>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Prénom: </span>
									<input
										type='text'
										className='form-control w-75'
										placeholder='Prénom'
										value={value.fname}
										onChange={(e) =>
											setValue({ ...value, fname: e.target.value })
										}
									/>
								</div>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Post-Nom: </span>
									<input
										type='text'
										className='form-control w-75'
										placeholder='Post-Nom'
										value={value.lname}
										onChange={(e) =>
											setValue({ ...value, lname: e.target.value })
										}
									/>
								</div>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Phone: </span>
									<CleavePhone
										placeholder='Téléphone'
										className='form-control w-75'
										options={{
											phone: true,
											phoneRegionCode: 'CD',
										}}
										value={value.phone}
										onChange={(e) =>
											setValue({ ...value, phone: e.target.value })
										}
									/>
								</div>
								{value.initUpdated ? (
									<>
										<div className='form-group d-flex'>
											<button
												type='button'
												className='btn btn-danger form-control'
												onClick={deleteExistingClient}>
												Supprimer
											</button>
											<button
												type='submit'
												className='btn btn-success form-control ml-2'>
												Mettre à jour
											</button>
										</div>
										<button
											type='reset'
											className='btn btn-warning form-control mr-2'
											data-dismiss='modal'
											aria-label='Close'
											onClick={() =>
												setValue({
													...value,
													card_id: '',
													fname: '',
													lname: '',
													phone: '',
													initUpdated: false,
												})
											}>
											Annuler
										</button>
									</>
								) : (
									<button
										type='submit'
										className='btn btn-success form-control w-75 float-right'>
										Ajouter
									</button>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
