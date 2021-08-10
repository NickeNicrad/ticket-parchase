import React, { useEffect, useState } from 'react';
import CleavePhone from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.cd';
import {
	createClientChild,
	getAllChildren,
	updateClientChild,
} from '../../../api';
import ChildReservationModal from './ChildReservationModal';
import ConfirmModal from './ConfirmModal';

function SponsorModal(props) {
	const [children, setChildren] = useState([]);
	const [child, setChild] = useState({});
	const [warning, setWarnig] = useState();
	const [values, setValues] = useState({
		id: '',
		card_id: '',
		fname: '',
		lname: '',
		phone: '',
		initUpdate: false,
		data: {},
		search: '',
	});

	const createNewChild = (e) => {
		e.preventDefault();
		const { card_id, fname, lname, phone } = values;
		const { id } = props;
		const client_child = { card_id, fname, lname, phone, client_id: id };
		createClientChild(client_child)
			.then((res) => {
				loadChildren();
				setWarnig(res.data);
				setValues({ ...values, card_id: '', fname: '', lname: '', phone: '' });
			})
			.catch((err) => {
				setWarnig(err.response.data);
				document.querySelector('#warning-msg-id').style.display = 'block';
				setTimeout(
					() =>
						(document.querySelector('#warning-msg-id').style.display = 'none'),
					3000
				);
			});
	};

	const updateChild = () => {
		updateClientChild(values)
			.then((res) => alert(res.data))
			.catch((err) => {
				if (err.response) return alert(err.response.data);
			});
	};

	const deleteExistingClientChild = (child) => {
		setChild({ ...child });
	};

	const handleValues = (data) => {
		setValues({ ...values, data });
	};

	const loadChildren = () => {
		getAllChildren().then(async (data) => {
			if (data.error) {
				await alert(data.error);
			} else {
				await setChildren([...data]);
			}
		});
	};

	const initChild = (child) => {
		const { id, card_id, fname, lname, phone } = child;
		setValues({
			...values,
			id,
			card_id,
			fname,
			lname,
			phone,
			initUpdate: true,
		});
	};

	const filteredChildren = children.filter(
		(child_item) =>
			(
				child_item.id +
				' ' +
				child_item.fname +
				' ' +
				child_item.lname +
				' ' +
				child_item.card_id
			)
				.toLowerCase()
				.indexOf(values.search.toLowerCase()) !== -1
	);

	useEffect(() => {
		loadChildren();
	}, []);

	return (
		<>
			<div
				className='modal fade'
				id='sponsorModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='sponsorModalLabel'
				aria-hidden='true'>
				<div
					className='modal-dialog modal-dialog-centered modal-lg'
					role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='sponsorModalLabel'>
								Parrainage
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
								onClick={() =>
									setValues({
										...values,
										card_id: '',
										fname: '',
										lname: '',
										phone: '',
										initUpdate: false,
									})
								}>
								<i className='material-icons'>close</i>
							</button>
						</div>
						<div className='modal-body'>
							<div className='mb-4'>
								<ul>
									<li>
										N° Carte d'Identité:{' '}
										<span className='font-weight-bold'>
											{props && props.card_id}
										</span>
									</li>
									<li>
										Nom de Famille:{' '}
										<span className='font-weight-bold text-capitalize'>
											{props && props.fname} {props && props.lname}
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

							<center className='mb-4'>
								<input
									id='search-member-id'
									className='form-control'
									type='text'
									placeholder='recherche...'
									value={values.search}
									onChange={(e) =>
										setValues({ ...values, search: e.target.value })
									}
								/>
							</center>

							<div className='d-flex justify-content-end mb-2'>
								<div className='d-flex gap-1'>
									<button
										data-toggle='modal'
										data-target='#newMemberModal'
										className='btn btn-secondary btn-block btn-sm m-1 d-flex'
										onClick={() =>
											setValues({
												...values,
												card_id: '',
												fname: '',
												lname: '',
												phone: '',
												initUpdate: false,
											})
										}>
										<i className='material-icons'>add</i>
										<span
											data-toggle='tooltip'
											title='ajouter nouveau membre'
											data-placement='bottom'>
											Ajouter
										</span>
									</button>
									<button className='btn btn-secondary btn-block btn-sm m-1 d-flex'>
										<i className='material-icons'>print</i>
										<span
											data-toggle='tooltip'
											title='imprimer la liste'
											data-placement='bottom'>
											Imprimer
										</span>
									</button>
								</div>
							</div>

							<div>
								<div>
									<div className='card card-transactions'>
										<div className='card-body'>
											<h5 className='card-title'>
												List des Membres de la Famille
												<span
													onClick={loadChildren}
													className='card-title-helper blockui-transactions cursor-pointer'>
													<i className='material-icons'>refresh</i>
												</span>
											</h5>
											<div className='table-responsive' id='member-tab-id'>
												<table className='table table-striped'>
													<thead>
														<tr>
															<th scope='col'>#</th>
															<th scope='col'>Numéro ID</th>
															<th scope='col'>Nom</th>
															<th scope='col'>Phone</th>
															<th scope='col'>Modification</th>
														</tr>
													</thead>
													<tbody>
														{filteredChildren
															.filter(
																(child_item) =>
																	child_item.client_id === props.id
															)
															.map((child_item, index) => (
																<tr key={child_item.id}>
																	<td>{index + 1}</td>
																	<td>{child_item.card_id}</td>
																	<td className='text-capitalize'>
																		{`${child_item.fname} ${child_item.lname}`}
																	</td>
																	<td>{child_item.phone}</td>
																	<td className='d-flex justify-content-around'>
																		<button
																			className='btn btn-xs action-item'
																			data-toggle='modal'
																			data-target='#childReservationModal'
																			onClick={handleValues.bind(
																				this,
																				child_item
																			)}>
																			<i
																				data-toggle='tooltip'
																				title='reserver'
																				data-placement='bottom'
																				className='material-icons'>
																				event_seat
																			</i>
																		</button>
																		<button
																			className='btn btn-xs action-item text-success'
																			data-toggle='modal'
																			data-target='#newMemberModal'
																			onClick={initChild.bind(
																				this,
																				child_item
																			)}>
																			<i
																				className='material-icons'
																				data-toggle='tooltip'
																				title='modifier'
																				data-placement='bottom'>
																				edit
																			</i>
																		</button>
																		<button
																			className='btn btn-xs action-item text-danger'
																			data-toggle='modal'
																			data-target='#confirmModal'
																			onClick={deleteExistingClientChild.bind(
																				this,
																				child_item
																			)}>
																			<i
																				className='material-icons'
																				data-toggle='tooltip'
																				title='supprimer'
																				data-placement='bottom'>
																				delete
																			</i>
																		</button>
																	</td>
																</tr>
															))}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ChildReservationModal {...values.data} />
			<ConfirmModal child={child} />

			{/* member modal start */}

			<div
				className='modal fade'
				id='newMemberModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='newMemberModalLabel'
				aria-hidden='true'>
				<div
					className='modal-dialog modal-dialog-centered modal-md'
					role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='newMemberModalLabel'>
								{values.initUpdate ? 'Mise à jour du Membre' : 'Nouveau Membre'}
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
								onClick={() =>
									setValues({
										...values,
										card_id: '',
										fname: '',
										lname: '',
										phone: '',
										initUpdate: false,
									})
								}>
								<i className='material-icons'>close</i>
							</button>
						</div>
						<div className='modal-body'>
							<form onSubmit={values.initUpdate ? updateChild : createNewChild}>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Carte ID: </span>
									<input
										className='form-control w-75'
										type='number'
										placeholder='Numéro du Carte'
										value={values.card_id}
										onChange={(e) =>
											setValues({ ...values, card_id: e.target.value })
										}
									/>
								</div>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Nom: </span>
									<input
										className='form-control w-75'
										type='text'
										placeholder='Nom'
										value={values.fname}
										onChange={(e) =>
											setValues({ ...values, fname: e.target.value })
										}
									/>
								</div>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Prénom: </span>
									<input
										className='form-control w-75'
										type='text'
										placeholder='Post-Nom'
										value={values.lname}
										onChange={(e) =>
											setValues({ ...values, lname: e.target.value })
										}
									/>
								</div>
								<div className='form-group d-flex justify-content-between align-items-center'>
									<span>Téléphone: </span>
									<CleavePhone
										placeholder='Téléphone'
										className='form-control w-75'
										options={{
											phone: true,
											phoneRegionCode: 'CD',
										}}
										value={values.phone}
										onChange={(e) =>
											setValues({ ...values, phone: e.target.value })
										}
									/>
								</div>

								<div className='modal-footer'>
									<button className='btn btn-warning' type='reset'>
										Annuler
									</button>
									<button className='btn btn-success' type='submit'>
										{values.initUpdate ? 'Mettre à jour' : 'Ajouter'}
									</button>
								</div>
							</form>

							<div className='m-3 text-center'>
								<span id='warning-msg-id'>{warning}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* member modal end */}
		</>
	);
}

export default SponsorModal;
