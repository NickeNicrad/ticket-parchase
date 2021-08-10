import React, { Component } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import profile2 from '../../images/avatars/profile-image-2.png';
import Navbar from '../Navbar';
import {
	getProfile,
	getAdminProfile,
	getUsers,
	getAllChats,
	sendMessage,
	deleteMessage,
} from '../../api/index';

class Messages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ''.trim(),
			users: [],
			account: '',
			admin: '',
			initUser: '',
			msgContent: ''.trim(),
			conversations: [],
			lastMsg: [],
		};
		this.loadAdminProfile();
		this.loadProfile();
		this.loadUsers();
		this.loadMessages();
	}

	loadProfile = () =>
		getProfile().then((res) =>
			this.setState({ ...this.state.account, account: res.data })
		);
	loadAdminProfile = () =>
		getAdminProfile().then((res) =>
			this.setState({ ...this.state.admin, admin: res.data })
		);
	loadUsers = () =>
		getUsers().then((users) => this.setState({ ...this.state.users, users }));
	loadMessages = () =>
		getAllChats().then((res) =>
			this.setState({ ...this.state.conversations, conversations: res.data })
		);

	initChat = (user) => {
		this.loadMessages();
		this.setState({ ...this.state.initUser, initUser: user });
	};

	createMessage = (e) => {
		e.preventDefault();
		const { account, initUser, msgContent } = this.state;
		const message = {
			uid1: account.id,
			uid2: initUser.id,
			msgContent,
		};

		sendMessage(message)
			.then((res) => {
				this.setState({ ...this.state.msgContent, msgContent: '' });
				console.log(res.data);
				this.loadMessages();
			})
			.catch((error) => console.log(error.response.data));
	};

	deleteUserMessage = (message) => {
		deleteMessage(message).then((res) => {
			console.log(res.data);
			this.loadMessages();
		});
	};
	componentDidMount = () => {
		this.loadProfile();
		this.loadAdminProfile();
		this.loadUsers();
	};

	render() {
		dayjs.extend(relativeTime);
		const { account, admin, initUser } = this.state;
		const filteredUsers = this.state.users.filter(
			(user) =>
				user.active === true &&
				user.id !== account.id &&
				(user.fname + ' ' + user.lname)
					.toLowerCase()
					.indexOf(this.state.search.toLowerCase()) !== -1
		);
		const filteredConversation = this.state.conversations.filter(
			(msg) =>
				(msg.uid1 === account.id && msg.uid2 === initUser.id) ||
				(msg.uid1 === initUser.id && msg.uid2 === account.id)
		);
		filteredUsers.unshift(admin);
		return (
			<div className='page-container'>
				<Navbar />
				<div className='page-content px-3 msg-g-container'>
					<div className='main-wrapper p-0'>
						<div className='row msg-bg-global'>
							<div
								className={`col-xl-5 col-lg-12 col-sm-12 p-0 px-lg-4 ${
									this.state.initUser ? 'd-none d-xl-block' : null
								}`}>
								<div className='tab-pane fade show active bg-muted msg-bg'>
									<div className='d-flex flex-column h-100'>
										<div className='hide-scrollbar'>
											<div className='container-fluid'>
												<h4 className='font-bold mb-2 mt-3'>Coversation</h4>

												<div className='form-group mb-2'>
													<input
														id='msg-user-search'
														type='text'
														className='form-control form-control-lg'
														placeholder='recherche...'
														value={this.state.search}
														onChange={(e) =>
															this.setState({
																...this.state.search,
																search: e.target.value,
															})
														}
													/>
												</div>

												<nav className='nav d-block list-discussions-js mb-n6 conversations'>
													<div className='text-reset nav-link p-0 mb-4'>
														{filteredUsers &&
															filteredUsers.map((user, index) => {
																const last_msg = this.state.conversations
																	.filter(
																		(msg) =>
																			(msg.uid1 === account.id &&
																				msg.uid2 === user.id) ||
																			(msg.uid1 === user.id &&
																				msg.uid2 === account.id)
																	)
																	.map((msg) => msg.msg);
																const msg_time = this.state.conversations
																	.filter(
																		(msg) =>
																			(msg.uid1 === account.id &&
																				msg.uid2 === user.id) ||
																			(msg.uid1 === user.id &&
																				msg.uid2 === account.id)
																	)
																	.map((msg) => msg.updatedAt);

																return (
																	<div
																		key={index}
																		className='card card-active-listener p-0'
																		onClick={this.initChat.bind(this, user)}>
																		<div className='card-body'>
																			<div className='media'>
																				<div className='avatar avatar-online mr-2'>
																					<img
																						className='avatar-img'
																						height='55'
																						src={profile2}
																						alt=''
																					/>
																				</div>
																				<div className='media-body overflow-hidden'>
																					<div className='d-flex align-items-center mb-1'>
																						<h6 className='mb-0 mr-auto font-weight-bold text-capitalize'>
																							{`${user.fname} ${user.lname}`}
																						</h6>
																						<p className='small text-muted text-nowrap ml-4'>
																							{dayjs(msg_time.pop()).fromNow()}
																						</p>
																					</div>
																					<div className='text-truncate text-break'>
																						{last_msg && last_msg.pop()}
																						<span className='typing-dots'>
																							<span>.</span>
																							<span>.</span>
																							<span>.</span>
																						</span>
																						<span className='badge badge-light float-right'>
																							{last_msg.length &&
																							last_msg.length > 0
																								? last_msg.length + 1
																								: last_msg.length}
																						</span>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																);
															})}
													</div>
												</nav>
											</div>
										</div>
									</div>
								</div>
							</div>
							{this.state.initUser && this.state.initUser ? (
								<div
									className={`col-xl-7 col-lg-12 col-sm-12 bg-muted msg-bg ${
										this.state.initUser ? null : 'd-none d-xl-block'
									}`}>
									<div className='chat-header border-bottom py-4 py-lg-6 px-lg-8 mb-2'>
										<div className='container-xxl'>
											<div className='row align-items-center'>
												<div className='col-6 col-xl-6'>
													<div className='media text-center text-xl-left d-flex align-items-center'>
														<button
															className='btn btn-xs d-xl-none p-0 d-flex'
															onClick={() =>
																this.setState({
																	...this.state,
																	initUser: false,
																})
															}>
															<i className='material-icons text-primary'>
																chevron_left
															</i>
														</button>

														<div className='avatar avatar-sm avatar-online mr-2'>
															<img
																src={profile2}
																height='45'
																className='avatar-img'
																alt=''
															/>
														</div>
														<div className='media-body align-self-center'>
															<h6 className='text-truncate mb-n1 font-weight-bold text-capitalize'>
																{`${
																	this.state.initUser &&
																	this.state.initUser.fname
																} ${
																	this.state.initUser &&
																	this.state.initUser.lname
																}`}
															</h6>
															<small
																className={`badge badge-dot ${
																	navigator.onLine
																		? 'badge-success'
																		: 'badge-dange'
																} d-inline-block mr-1`}
															/>
															{navigator.onLine ? (
																<small className='text-muted'>enligne</small>
															) : null}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className='message-container'>
										{filteredConversation &&
											filteredConversation
												.filter(
													(item, index, self) =>
														index ===
														self.findIndex(
															(conv) =>
																dayjs(conv.createdAt).format('YYYY-MM-DD') ===
																dayjs(item.createdAt).format('YYYY-MM-DD')
														)
												)
												.map((converse, index) => (
													<div key={index}>
														<div className='message-divider my-9 mx-lg-5 mb-3'>
															<div className='row align-items-center'>
																<div className='col'>
																	<hr />
																</div>
																<div className='col-auto'>
																	<small className='text-muted'>
																		{dayjs(converse.createdAt).format(
																			'dddd, DD/MM/YYYY'
																		)}
																	</small>
																</div>
																<div className='col'>
																	<hr />
																</div>
															</div>
														</div>

														{filteredConversation &&
															filteredConversation
																.filter(
																	(item) =>
																		dayjs(item.createdAt).format(
																			'YYYY-MM-DD'
																		) ===
																		dayjs(converse.createdAt).format(
																			'YYYY-MM-DD'
																		)
																)
																.map((msg, index) =>
																	msg.uid1 === account.id ? (
																		<div
																			key={index}
																			className='row d-flex justify-content-end align-items-center'>
																			<div className='dropdown'>
																				<a
																					href='#'
																					className='nav-link dropdown-toggle'
																					id='navbarDropdown'
																					data-toggle='dropdown'
																					aria-haspopup='true'
																					aria-expanded='false'></a>
																				<div
																					className='dropdown-menu'
																					aria-labelledby='navbarDropdown'>
																					<a href className='dropdown-item'>
																						<div className='dropdown-item-body d-flex justify-content-between'>
																							<span className='font-weight-bold'>
																								Copier
																							</span>
																							<i className='material-icons'>
																								content_copy
																							</i>
																						</div>
																					</a>

																					<a
																						href
																						className='dropdown-item'
																						onClick={this.deleteUserMessage.bind(
																							this,
																							msg
																						)}>
																						<div className='dropdown-item-body d-flex justify-content-between'>
																							<span className='font-weight-bold'>
																								Supprimer
																							</span>
																							<i className='material-icons'>
																								delete_outline
																							</i>
																						</div>
																					</a>
																				</div>
																			</div>
																			<div className='message-body card col-7'>
																				<div className='message-row p-lg-2 p-1'>
																					<div className='d-flex align-items-center'>
																						<div className='message-content'>
																							<h6 className='mb-2 font-weight-bold text-capitalize'>
																								{`${account.fname} ${account.lname}`}
																							</h6>
																							<div className='text-break'>
																								{msg.msg}
																							</div>
																							<div className='mt-1'>
																								<small className='opacity-65'>
																									{dayjs(
																										msg.createdAt
																									).fromNow()}
																								</small>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																			<span className='col-1 avatar avatar-sm mr-5 mr-lg-4'>
																				<img
																					src={profile2}
																					height='45'
																					alt=''
																				/>
																			</span>
																		</div>
																	) : (
																		<div className='row d-flex align-items-center'>
																			<span className='col-1 avatar avatar-sm mr-5 mr-lg-2'>
																				<img
																					src={profile2}
																					height='45'
																					alt=''
																				/>
																			</span>
																			<div className='message-body card col-7'>
																				<div className='message-row p-lg-2 p-1'>
																					<div className='d-flex align-items-center'>
																						<div className='message-content'>
																							<h6 className='mb-2 font-weight-bold text-capitalize'>
																								{`${initUser.fname} ${initUser.lname}`}
																							</h6>
																							<div>{msg.msg}</div>
																							<div className='mt-1'>
																								<small className='opacity-65'>
																									{dayjs(
																										msg.createdAt
																									).fromNow()}
																								</small>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																			<div className='dropdown'>
																				<a
																					href='#'
																					className='nav-link dropdown-toggle'
																					id='navbarDropdown'
																					data-toggle='dropdown'
																					aria-haspopup='true'
																					aria-expanded='false'></a>
																				<div
																					className='dropdown-menu'
																					aria-labelledby='navbarDropdown'>
																					<a href className='dropdown-item'>
																						<div className='dropdown-item-body d-flex justify-content-between'>
																							<span className='font-weight-bold'>
																								Copier
																							</span>
																							<i className='material-icons'>
																								content_copy
																							</i>
																						</div>
																					</a>

																					<a
																						href
																						className='dropdown-item'
																						onClick={this.deleteUserMessage.bind(
																							this,
																							msg
																						)}>
																						<div className='dropdown-item-body d-flex justify-content-between'>
																							<span className='font-weight-bold'>
																								Supprimer
																							</span>
																							<i className='material-icons'>
																								delete_outline
																							</i>
																						</div>
																					</a>
																				</div>
																			</div>
																		</div>
																	)
																)}
													</div>
												))}
									</div>

									<div className='chat-footer border-top py-4 py-lg-6 px-lg-8'>
										<div className='container-xxl px-2'>
											<form id='chat-id-2-form' onSubmit={this.createMessage}>
												<div className='form-row align-items-center'>
													<div className='col'>
														<div className='input-group'>
															{/* Textarea */}
															<textarea
																id='chat-id-2-input'
																className='form-control border-0'
																placeholder='Tapez votre message ici...'
																rows={1}
																data-autosize='true'
																style={{
																	overflow: 'hidden',
																	overflowWrap: 'break-word',
																	resize: 'none',
																	height: 46,
																}}
																value={this.state.msgContent}
																onChange={(e) =>
																	this.setState({
																		...this.state.msgContent,
																		msgContent: e.target.value,
																	})
																}
															/>
														</div>
													</div>
													{/* Submit button */}
													<div className='col-auto'>
														<button
															id='send-msg-btn'
															type='submit'
															className='btn btn-ico btn-success rounded-circle d-flex justify-content-center align-items-center'
															disabled={this.state.msgContent === ''}>
															<i className='material-icons'>send</i>
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
							) : (
								<div className='col-xl-7 col-lg-12  bg-muted d-none d-xl-block'>
									<div className='h-100 d-flex justify-content-center align-items-center'>
										<div className='empty-chat'>
											<center>
												<img height='75' src={profile2} alt='' />
											</center>
											<center>
												<h4 className='mt-3 text-center text-capitalize'>
													{`${this.state.account.fname} ${this.state.account.lname}`}
												</h4>
												<p>
													Veuillez sélectionner un utilisateur pour commencer la
													conversation
												</p>
											</center>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Messages;
