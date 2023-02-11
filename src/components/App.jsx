import { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from '../shared/components/Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import ErrorNotification from 'shared/components/Notification/ErrorNotification';

import { searchImage } from 'shared/services/image-api';

import { AppSection } from './app.styled';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageDetails, setImageDetails] = useState({});
  const [loadMoreButton, setLoadMoreButton] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        const { hits } = await searchImage(searchQuery, page);
        setGallery(prevItems => [...prevItems, ...hits]);

        if (hits.length === 0) {
          setGallery([]);
          setLoading(false);
          return toast.warn(
            `No images for ${searchQuery}. Please try something else`
          );
        }
        if (hits.length <= 11) {
          setLoading(false);
          toast.warn(
            `We're sorry, but you've reached the end of search results.`
          );
        } else {
          setLoadMoreButton(true);
        }
      } catch (error) {
        setError(error.message);
        setLoadMoreButton(false);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [searchQuery, page]);

  const newSearch = useCallback(
    state => {
      if (state.searchQuery !== searchQuery) {
        setSearchQuery(state.searchQuery);
        setGallery([]);
        setPage(1);
      } else
        toast.warn(
          'Please enter new text for search, the result of current search is already shown'
        );
      setLoadMoreButton(false);
    },
    [searchQuery]
  );

  const toggleModal = useCallback(
    (largeImageURL, tags) => {
      if (!showModal) {
        setShowModal(true);
        setImageDetails({ largeImageURL, tags });
      } else setShowModal(false);
    },
    [showModal]
  );

  const loadMore = useCallback(() => {
    setLoadMoreButton(false);
    setPage(page => page + 1);
  }, []);

  return (
    <AppSection>
      <Searchbar onSubmit={newSearch} />
      {Boolean(gallery.length) && (
        <ImageGallery openModal={toggleModal} items={gallery} />
      )}
      {Boolean(loading) && <Loader />}
      {Boolean(loadMoreButton) && <Button loadMore={loadMore} />}
      {Boolean(error) && <ErrorNotification errorMessage={error} />}
      {Boolean(showModal) && (
        <Modal
          toggleModal={toggleModal}
          urlImage={imageDetails}
          setImageDetails={setImageDetails}
        />
      )}
      <ToastContainer theme="light" autoClose={3000} />
    </AppSection>
  );
};

export default App;
