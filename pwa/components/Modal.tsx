interface ModalProps {
	showModal: boolean;
	setShowModal(arg0: boolean): void;
	setAgreeTerms(arg0: boolean): void;
}

const Modal = ({ showModal, setShowModal, setAgreeTerms }: ModalProps) => {
	return (
		<>
			{showModal ? (
				<div className="fixed z-10 inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen px-4 text-center">
						<div className="fixed inset-0 transition-opacity">
							<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<div
							className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
							role="dialog"
							aria-modal="true"
							aria-labelledby="modal-headline"
						>
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								<h3
									className="text-lg leading-6 font-medium text-gray-900"
									id="modal-headline"
								>
									Lorem ipsum dolor sit amet.
								</h3>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime itaque consequatur, nulla, illo nostrum voluptatum dicta illum est doloremque magnam impedit nemo suscipit libero ab quia, amet quo. Nihil, iure?

										Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error qui deleniti corporis accusamus quisquam quam? Architecto numquam facilis repudiandae sapiente cupiditate molestias eaque! Fuga eaque, dolorem ab quia laboriosam dicta!
										Explicabo optio consectetur autem, dolorum libero voluptatem doloremque deleniti? Obcaecati quae eaque aut soluta sint, hic et suscipit libero id sapiente, harum odio quidem inventore neque maxime molestias, atque dolores.
									</p>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								<button
									onClick={() => setShowModal(false)}
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
								>
									Close
								</button>
								<button
									type="button"
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={() => {
										setAgreeTerms(true);
										setShowModal(false);
									}}
								>
									Agree
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}

export default Modal;