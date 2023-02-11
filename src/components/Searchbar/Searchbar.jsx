import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import initialState from './initialState';

import {
  SearchbarHeader,
  SearchForm,
  SearchFormButton,
  SearchButtonLabel,
  SearchFormInput,
} from './searchbar.styled.jsx';

const Searchbar = ({ onSubmit }) => {
  const [state, setState] = useState({ ...initialState });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { value } = e.currentTarget.elements.searchQuery;
    if (value.trim() === '') {
      return toast.warn('Please enter what you are looking for');
    }
    onSubmit({ ...state });
    setState({ ...initialState });
  };

  const { searchQuery } = state;

  return (
    <SearchbarHeader>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <SearchButtonLabel>Search</SearchButtonLabel>
        </SearchFormButton>
        <SearchFormInput
          type="text"
          autocomplete="off"
          name="searchQuery"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search images and photos"
          required
        />
      </SearchForm>
    </SearchbarHeader>
  );
};

export default memo(Searchbar);

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
