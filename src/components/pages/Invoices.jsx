import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import QRCode from 'qrcode';
import PrintInvoiceModal from './modals/PrintInvoiceModal';
import ConfirmModal from './modals/ConfirmModal';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getProfile, getAllInvoices, updateInvoice } from '../../api/index';

function Invoices() {
	dayjs.extend(relativeTime);
	const [account, setAccount] = useState({});
	const [invoices, setInvoices] = useState([]);
	const [invoicePrint, setInvoicePrint] = useState({});
	const [imageUrl, setImageUrl] = useState();

	const printInvoices = () => {
		const pageToPrint = document.querySelector('#bg-image-id').innerHTML;
		const body = document.body.innerHTML;
		document.body.innerHTML = pageToPrint;
		window.print();
		document.body.innerHTML = body;
		window.location.reload();
	};

	const loadProfile = () =>
		getProfile().then((res) => setAccount({ ...res.data }));

	const loadInvoices = () =>
		getAllInvoices().then((res) => setInvoices([...res.data]));

	const generateQRCode = (invoice) => {
		const { verification_code } = invoice;
		QRCode.toDataURL(`${verification_code}`, (err, imageUrl) => {
			setImageUrl(imageUrl);
			console.log(err);
		});
	};

	const demandPermission = (invoice) => {
		updateInvoice({ ...invoice, request: true })
			.then((res) => {
				console.log(res.data);
				loadInvoices();
			})
			.catch((err) => console.log(err.reposponse));
	};

	const printInvoice = (invoice) => {
		updateInvoice({ ...invoice, request: true, printed: true })
			.then((res) => {
				console.log(res.data);
				loadInvoices();
				setInvoicePrint({ ...invoice });
				generateQRCode({ ...invoice });
			})
			.then(() => printInvoices())
			.catch((err) => console.log(err.reposponse.data));
	};

	const deleteExistingInvoice = (invoice) => {
		setInvoicePrint({ ...invoice });
	};

	useEffect(() => {
		loadProfile();
		loadInvoices();
	}, []);

	return (
		<div className='page-container'>
			<Navbar />
			<div className='page-content' id='invoices-container-id'>
				<div className='main-wrapper'>
					{invoices &&
						invoices
							.sort((a, b) => b.id - a.id)
							.filter(
								(item, index, self) =>
									item.user_id === account.id &&
									index ===
										self.findIndex(
											(val) =>
												dayjs(val.createdAt).format('DD/MMMM/YYYY') ===
												dayjs(item.createdAt).format('DD/MMMM/YYYY')
										)
							)
							.map((date) => (
								<div>
									<div className='d-flex justify-content-center mb-3'>
										{dayjs(date.createdAt).format('dddd, DD/MMMM/YYYY')}
									</div>
									<div className='row'>
										{invoices
											.filter(
												(inv) =>
													inv.user_id === account.id &&
													inv.printed === false &&
													dayjs(inv.createdAt).format('DD/MMMM/YYYY') ===
														dayjs(date.createdAt).format('DD/MMMM/YYYY')
											)
											.map((invoice, index) => (
												<div className='col-lg-3' key={index}>
													<div className='card hover-shadow-lg'>
														<div className='card-header border-0 pb-0'>
															<div className='d-flex justify-content-between align-items-center'>
																<div>
																	<h6 className='mb-0 text-capitalize'>
																		{dayjs(invoice.createdAt).format('HH : mm')}
																	</h6>
																</div>
																<h6 className='mb-0 text-capitalize'>
																	{invoice.for_kids === true
																		? 'Enfant'
																		: 'Adulte'}
																</h6>
																<div className='text-right'>
																	{invoice.price}$
																</div>
															</div>
														</div>
														<div className='card-body text-center p-4'>
															<h5 className='h6 mt-1 mb-2'>
																<span className='text-capitalize font-weight-bold'>
																	{invoice.fname} {invoice.lname}
																</span>
															</h5>

															<h6>{invoice.boat_name}</h6>

															<span className='clearfix'></span>
															<div className='d-flex justify-content-center mb-2'>
																<small>{invoice.class_name}</small>
																<small className='mx-1'> | </small>
																<small>{invoice.destination}</small>
															</div>
															{invoice.request === true ? (
																<span className='badge badge-pill badge-warning'>
																	demande en cours...
																</span>
															) : (
																<div>
																	{invoice.print_request === true ? (
																		<span className='badge badge-pill badge-info'>
																			acceptée
																		</span>
																	) : (
																		<span className='badge badge-pill badge-success'>
																			en attente
																		</span>
																	)}
																</div>
															)}
														</div>
														<div className='card-footer py-2'>
															<div className='actions d-flex justify-content-around px-5'>
																<button
																	className='btn btn-xs action-item text-info'
																	onClick={demandPermission.bind(this, invoice)}
																	disabled={invoice.print_request === true}>
																	<i className='material-icons'>task_alt</i>
																</button>
																<button
																	className='btn btn-xs action-item text-warning'
																	onClick={printInvoice.bind(this, invoice)}
																	disabled={invoice.print_request === false}>
																	<i className='material-icons'>print</i>
																</button>
																<button
																	className='btn btn-xs action-item text-danger'
																	data-toggle='modal'
																	data-target='#confirmModal'
																	disabled={invoice.print_request === false}
																	onClick={deleteExistingInvoice.bind(
																		this,
																		invoice
																	)}>
																	<i className='material-icons'>
																		delete_outline
																	</i>
																</button>
															</div>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							))}
				</div>
			</div>
			<PrintInvoiceModal {...invoicePrint} imageUrl={imageUrl} />
			<ConfirmModal invoice={{ ...invoicePrint }} />
			<Footer />
		</div>
	);
}

export default Invoices;
