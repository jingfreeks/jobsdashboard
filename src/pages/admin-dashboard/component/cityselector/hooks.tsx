import { useReducer, useMemo } from "react";

interface CityState {
  showAddCityModal: boolean;
  showEditCityModal: boolean;
  editCityId: string | null;
  editCityName: string;
  editStateId: string;
  newCityName: string;
  newStateId: string;
  newImage: File | null;
  newImagePreview: string | null;
  searchTerm: string;
  selectedStateFilter: string;
}

type CityAction =
  | { type: 'OPEN_ADD_MODAL' }
  | { type: 'CLOSE_ADD_MODAL' }
  | { type: 'OPEN_EDIT_MODAL'; payload: { id: string; name: string; stateId: string } }
  | { type: 'CLOSE_EDIT_MODAL' }
  | { type: 'SET_NEW_CITY_NAME'; payload: string }
  | { type: 'SET_NEW_STATE_ID'; payload: string }
  | { type: 'SET_NEW_IMAGE'; payload: File | null }
  | { type: 'SET_NEW_IMAGE_PREVIEW'; payload: string | null }
  | { type: 'SET_EDIT_CITY_NAME'; payload: string }
  | { type: 'SET_EDIT_STATE_ID'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_STATE_FILTER'; payload: string }
  | { type: 'RESET_FORM' };

const initialState: CityState = {
  showAddCityModal: false,
  showEditCityModal: false,
  editCityId: null,
  editCityName: "",
  editStateId: "",
  newCityName: "",
  newStateId: "",
  newImage: null,
  newImagePreview: null,
  searchTerm: "",
  selectedStateFilter: "",
};

const cityReducer = (state: CityState, action: CityAction): CityState => {
  switch (action.type) {
    case 'OPEN_ADD_MODAL':
      return { ...state, showAddCityModal: true };
    case 'CLOSE_ADD_MODAL':
      return { 
        ...state, 
        showAddCityModal: false, 
        newCityName: "",
        newStateId: "",
        newImage: null,
        newImagePreview: null
      };
    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        showEditCityModal: true,
        editCityId: action.payload.id,
        editCityName: action.payload.name,
        editStateId: action.payload.stateId,
      };
    case 'CLOSE_EDIT_MODAL':
      return {
        ...state,
        showEditCityModal: false,
        editCityId: null,
        editCityName: "",
        editStateId: "",
      };
    case 'SET_NEW_CITY_NAME':
      return { ...state, newCityName: action.payload };
    case 'SET_NEW_STATE_ID':
      return { ...state, newStateId: action.payload };
    case 'SET_NEW_IMAGE':
      return { ...state, newImage: action.payload };
    case 'SET_NEW_IMAGE_PREVIEW':
      return { ...state, newImagePreview: action.payload };
    case 'SET_EDIT_CITY_NAME':
      return { ...state, editCityName: action.payload };
    case 'SET_EDIT_STATE_ID':
      return { ...state, editStateId: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_STATE_FILTER':
      return { ...state, selectedStateFilter: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

export const Cityselectorhooks = () => {
  const [state, dispatch] = useReducer(cityReducer, initialState);

  // Memoized action creators for better performance
  const actions = useMemo(() => ({
    openAddModal: () => dispatch({ type: 'OPEN_ADD_MODAL' }),
    closeAddModal: () => dispatch({ type: 'CLOSE_ADD_MODAL' }),
    openEditModal: (id: string, name: string, stateId: string) => 
      dispatch({ type: 'OPEN_EDIT_MODAL', payload: { id, name, stateId } }),
    closeEditModal: () => dispatch({ type: 'CLOSE_EDIT_MODAL' }),
    setNewCityName: (name: string) => 
      dispatch({ type: 'SET_NEW_CITY_NAME', payload: name }),
    setNewStateId: (stateId: string) => 
      dispatch({ type: 'SET_NEW_STATE_ID', payload: stateId }),
    setNewImage: (image: File | null) => 
      dispatch({ type: 'SET_NEW_IMAGE', payload: image }),
    setNewImagePreview: (preview: string | null) => 
      dispatch({ type: 'SET_NEW_IMAGE_PREVIEW', payload: preview }),
    setEditCityName: (name: string) => 
      dispatch({ type: 'SET_EDIT_CITY_NAME', payload: name }),
    setEditStateId: (stateId: string) => 
      dispatch({ type: 'SET_EDIT_STATE_ID', payload: stateId }),
    setSearchTerm: (term: string) => 
      dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setStateFilter: (stateId: string) => 
      dispatch({ type: 'SET_STATE_FILTER', payload: stateId }),
    resetForm: () => dispatch({ type: 'RESET_FORM' }),
  }), []);

  // Memoized state selectors
  const selectors = useMemo(() => ({
    showAddCityModal: state.showAddCityModal,
    showEditCityModal: state.showEditCityModal,
    editCityId: state.editCityId,
    editCityName: state.editCityName,
    editStateId: state.editStateId,
    newCityName: state.newCityName,
    newStateId: state.newStateId,
    newImage: state.newImage,
    newImagePreview: state.newImagePreview,
    searchTerm: state.searchTerm,
    selectedStateFilter: state.selectedStateFilter,
  }), [state]);

  return {
    ...selectors,
    ...actions,
  };
}; 