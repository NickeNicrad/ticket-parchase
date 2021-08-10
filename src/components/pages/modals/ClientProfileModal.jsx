import React, { useState, useEffect } from 'react';
import profile2 from '../../../images/avatars/profile-image-2.png';
import bg_image from '../../../images/profile-bg.jpg';
import { getAllChildren, getAllInvoices, getAllBonus } from '../../../api';
import ConfirmModal from './ConfirmModal';

function ClientProfileModal(props) {
	const [allChildren, setChildren] = useState([]);
	const [allInvoices, setInvoices] = useState([]);
	const [allBonus, setBonus] = useState([]);
	const loadChildren = () =>
		getAllChildren().then((data) => {
			setChildren([...data]);
		});

	const loadInvoices = () =>
		getAllInvoices().then((res) => {
			setInvoices([...res.data]);
		});

	const loadBonus = () =>
		getAllBonus().then((res) => {
			setBonus([...res.data]);
		});

	useEffect(() => {
		loadChildren();
		loadInvoices();
		loadBonus();
	}, []);

	return (
		<>
			<div
				className='modal fade'
				id='clientProfileModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='clientProfileModalLabel'
				aria-hidden='true'>
				<div
					className='modal-dialog modal-dialog-centered modal-sm'
					role='document'>
					<div className='modal-content'>
						<div className='modal-body p-0'>
							<div>
								<div className='card-profile-container'>
									<button
										type='reset'
										className='close close-modal-btn'
										data-dismiss='modal'
										aria-label='Close'>
										<i className='material-icons'>close</i>
									</button>
									<img
										className='card-img-top'
										width='100'
										height='170'
										src={bg_image}
										alt=''
									/>
									<div className='d-flex justify-content-center card-profile-img'>
										<img
											className=''
											width='130'
											height='130'
											src={profile2}
											alt=''
										/>
									</div>
								</div>
								<div className='card-body'>
									<div className='d-flex justify-content-center'>
										<h4 className='text-capitalize mt-5'>
											{props && props.fname} {props && props.lname}
										</h4>
									</div>

									<div className='row'>
										<center className='col'>
											<p className='card-text'>
												{
													allInvoices.filter(
														(invoice) => invoice.client_id === props.id
													).length
												}{' '}
												billets
											</p>
											<p className='card-text'>
												{
													allBonus.filter(
														(bonus) => bonus.client_id === props.id
													).length
												}{' '}
												bonus
											</p>
										</center>
										<center className='col'>
											<p className='card-text'>
												{
													allChildren.filter(
														(child) => child.client_id === props.id
													).length
												}{' '}
												enfants
											</p>
										</center>
									</div>
									<div className='d-flex justify-content-around mt-2'>
										<button className='btn btn-outline-success btn-sm'>
											Modifier
										</button>
										<button
											className='btn btn-outline-danger btn-sm'
											data-toggle='modal'
											data-target='#confirmModal'>
											Supprimer
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ConfirmModal client={props} />
		</>
	);
}

export default ClientProfileModal;
