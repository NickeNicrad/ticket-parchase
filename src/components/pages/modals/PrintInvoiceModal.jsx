import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import logo from '../../../images/logo.png';

function PrintInvoiceModal(props) {
	dayjs.extend(relativeTime);

	return (
		<div className='invoice-container'>
			<div className='modal-body' id='bg-image-id'>
				<div className='mb-6'>
					<div className='d-flex justify-content-between align-items-center mb-4'>
						<div>
							<img src={logo} alt='' width='50' height='50' />
						</div>
						<div>
							<h4>Ets. BMB</h4>
						</div>
						<div>
							<small>Ticket N°: {props && props.id}</small>
						</div>
					</div>

					<div className='d-flex justify-content-between'>
						<div>
							<ul className='p-0'>
								<li>
									N° Identité:{' '}
									<span className='font-weight-bold'>
										{props && props.card_id}
									</span>
								</li>
								<li>
									Nom:{' '}
									<span className='font-weight-bold text-capitalize'>
										{props && props.fname} {props && props.lname}
									</span>
								</li>
								<li>
									Téléphone:{' '}
									<span className='font-weight-bold'>
										{props && props.phone}
									</span>
								</li>
							</ul>
						</div>
						{props && props.for_kids === true ? (
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
									{props && props.boat_name}
								</span>
							</li>
							<li>
								Classe:{' '}
								<span className='font-weight-bold'>
									{props && props.class_name}
								</span>
							</li>
							<li>
								départ de:{' '}
								<span className='font-weight-bold'>
									{props.destination && props.destination.split(' ')[0]}
								</span>
							</li>
							<li>
								destination:{' '}
								<span className='font-weight-bold'>
									{props.destination && props.destination.split(' ')[2]}
								</span>
							</li>
							<li className='d-flex'>
								date et heure:{' '}
								<span className='mx-2 font-weight-bold'>
									{props && dayjs(props.date).format('DD/MM/YYYY')}
								</span>
								à
								<span className='mx-2 font-weight-bold'>
									{props && props.departure_time}
								</span>
							</li>
						</ul>
						<div className='d-flex justify-content-around'></div>
						<hr />
						<div>
							Prix du Billet:{' '}
							<span className='font-weight-bold'>{props && props.price}$</span>
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
							<img width='150' height='150' src={props.imageUrl} alt='' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PrintInvoiceModal;
