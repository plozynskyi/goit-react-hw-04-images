import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { ModalBox, Overlay } from './modal.styled';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ toggleModal, urlImage, setImageDetails }) => {
  const closeModal = useCallback(
    ({ target, currentTarget, code }) => {
      if (target === currentTarget || code === 'Escape') {
        toggleModal();
        setImageDetails({});
      }
    },
    [setImageDetails, toggleModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', closeModal);

    return () => window.removeEventListener('keydown', closeModal);
  }, [closeModal]);

  let { largeImageURL, tags } = urlImage;

  return createPortal(
    <Overlay onClick={closeModal}>
      <ModalBox>
        <img src={largeImageURL} alt={tags} />
      </ModalBox>
    </Overlay>,
    modalRoot
  );
};

export default Modal;

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  setImageDetails: PropTypes.func.isRequired,
  urlImage: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }),
};
