import React from 'react';
import {
	deleteClient,
	deleteClientChild,
	deleteInvoice,
} from '../../../api/index';
function ConfirmModal(props) {
	const deleteItem = () => {
		if (props.client) {
			deleteClient(props.client).then((res) => window.location.reload());
		} else if (props.child) {
			deleteClientChild(props.child).then((res) => window.location.reload());
		} else if (props.invoice) {
			deleteInvoice(props.invoice).then((res) => window.location.reload());
		}
	};

	return (
		<div
			className='modal fade'
			id='confirmModal'
			tabIndex='-1'
			role='dialog'
			aria-labelledby='confirmModalLabel'
			aria-hidden='true'>
			<div className='modal-dialog modal-sm' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='confirmModalLabel'>
							confirmation
						</h5>
						<button
							type='button'
							className='close'
							data-dismiss='modal'
							aria-label='Close'>
							<i className='material-icons'>close</i>
						</button>
					</div>
					<div className='modal-body'>Voulez-vous vraiment supprimer?</div>
					<div className='modal-footer'>
						<button
							className='btn btn-success'
							data-dismiss='modal'
							aria-label='Close'
							type='submit'
							onClick={deleteItem}>
							accepter
						</button>
						<button
							className='btn btn-danger'
							type='button'
							data-dismiss='modal'
							aria-label='Close'>
							refuser
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConfirmModal;
