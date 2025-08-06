import { useReducer, useMemo } from "react";

interface BankState {
  showAddBankModal: boolean;
  showEditBankModal: boolean;
  editBankId: string | null;
  editBankName: string;
  newBankName: string;
}

type BankAction =
  | { type: 'OPEN_ADD_MODAL' }
  | { type: 'CLOSE_ADD_MODAL' }
  | { type: 'OPEN_EDIT_MODAL'; payload: { id: string; name: string } }
  | { type: 'CLOSE_EDIT_MODAL' }
  | { type: 'SET_NEW_BANK_NAME'; payload: string }
  | { type: 'SET_EDIT_BANK_NAME'; payload: string }
  | { type: 'RESET_FORM' };

const initialState: BankState = {
  showAddBankModal: false,
  showEditBankModal: false,
  editBankId: null,
  editBankName: "",
  newBankName: "",
};

const bankReducer = (state: BankState, action: BankAction): BankState => {
  switch (action.type) {
    case 'OPEN_ADD_MODAL':
      return { ...state, showAddBankModal: true };
    case 'CLOSE_ADD_MODAL':
      return { ...state, showAddBankModal: false, newBankName: "" };
    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        showEditBankModal: true,
        editBankId: action.payload.id,
        editBankName: action.payload.name,
      };
    case 'CLOSE_EDIT_MODAL':
      return {
        ...state,
        showEditBankModal: false,
        editBankId: null,
        editBankName: "",
      };
    case 'SET_NEW_BANK_NAME':
      return { ...state, newBankName: action.payload };
    case 'SET_EDIT_BANK_NAME':
      return { ...state, editBankName: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

export const Bankselectorhooks = () => {
  const [state, dispatch] = useReducer(bankReducer, initialState);

  // Memoized action creators for better performance
  const actions = useMemo(() => ({
    openAddModal: () => dispatch({ type: 'OPEN_ADD_MODAL' }),
    closeAddModal: () => dispatch({ type: 'CLOSE_ADD_MODAL' }),
    openEditModal: (id: string, name: string) => 
      dispatch({ type: 'OPEN_EDIT_MODAL', payload: { id, name } }),
    closeEditModal: () => dispatch({ type: 'CLOSE_EDIT_MODAL' }),
    setNewBankName: (name: string) => 
      dispatch({ type: 'SET_NEW_BANK_NAME', payload: name }),
    setEditBankName: (name: string) => 
      dispatch({ type: 'SET_EDIT_BANK_NAME', payload: name }),
    resetForm: () => dispatch({ type: 'RESET_FORM' }),
  }), []);

  // Memoized state selectors
  const selectors = useMemo(() => ({
    showAddBankModal: state.showAddBankModal,
    showEditBankModal: state.showEditBankModal,
    editBankId: state.editBankId,
    editBankName: state.editBankName,
    newBankName: state.newBankName,
  }), [state]);

  return {
    ...selectors,
    ...actions,
  };
};

