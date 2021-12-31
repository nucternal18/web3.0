import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { contractABI, contractAddress } from "../utils/constants";

type FormDataProps = {
  addressTo: string;
  amount: string;
  keyword: string;
  message: string;
};

interface ITransactionState {
  currentAccount: string;
  loading: boolean;
  formData: FormDataProps;
  transactionCount: string;
}
const initialState = {
  currentAccount: "",
  loading: true,
  formData: {
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  },
  transactionCount:
    typeof window !== "undefined"
      ? localStorage.getItem("transactionCount")
      : "",
};

export const TransactionContext = createContext<{
  state: ITransactionState;
  dispatch: Dispatch<any>;
  connectWallet: () => void;
  sendTransaction: (formData: FormDataProps) => void;
}>({
  state: initialState,
  dispatch: () => null,
  connectWallet: () => {},
  sendTransaction: () => {},
});

const { ethereum } = typeof window !== "undefined" && window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export enum ActionTypes {
  ACTION_REQUEST = "ACTION_REQUEST",
  ACTION_FAILURE = "ACTION_FAILURE",
  GET_CURRENT_ACCOUNT = "GET_CURRENT_ACCOUNT",
  SET_FORM_DATA = "SET_FORM_DATA",
  SET_TRANSACTION_COUNT = "SET_TRANSACTION_COUNT",
}

const transactionReducer = (state: ITransactionState, action: any) => {
  switch (action.type) {
    case ActionTypes.ACTION_REQUEST:
      return { ...state, loading: true };
    case ActionTypes.ACTION_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ActionTypes.GET_CURRENT_ACCOUNT:
      return { ...state, loading: false, currentAccount: action.payload };
    case ActionTypes.SET_FORM_DATA:
      return { ...state, loading: false, formData: action.payload };
    case ActionTypes.SET_TRANSACTION_COUNT:
      localStorage.setItem("transactionCount", action.payload);
      return { ...state, loading: false, transactionCount: action.payload };
    default:
      return state;
  }
};

const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum)
        return toast.info("Please install metamask and connect to your wallet");
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        dispatch({
          type: ActionTypes.GET_CURRENT_ACCOUNT,
          payload: accounts[0],
        });
        // getEthereumContract();
      } else {
        dispatch({
          type: ActionTypes.ACTION_FAILURE,
          payload: { message: "No account connected" },
        });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.ACTION_FAILURE,
        payload: { message: "No ethereum object found" },
      });
    }
  };

  const connectWallet = async () => {
    try {
      dispatch({ type: ActionTypes.ACTION_REQUEST });
      if (!ethereum)
        return toast.info("Please install metamask and connect to your wallet");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch({
        type: ActionTypes.GET_CURRENT_ACCOUNT,
        payload: accounts[0],
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.ACTION_FAILURE,
        payload: { message: "No ethereum object found" },
      });
    }
  };

  const sendTransaction = async (formData: FormDataProps) => {
    try {
      dispatch({ type: ActionTypes.ACTION_REQUEST });
      const { addressTo, amount, keyword, message } = formData;
      if (!ethereum)
        return toast.info("Please install metamask and connect to your wallet");
      console.log({ addressTo, amount, keyword, message });

      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      console.log("Awaiting transaction...");
      console.log("Current account: ", state.currentAccount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: state.currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWei
            value: parsedAmount._hex, // 0.00001 ETH
          },
        ],
      });
      console.log("Transaction sent!");

      const transactionHash = await transactionContract.transfer(
        addressTo,
        parsedAmount,
        keyword,
        message
      );
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.getTransactionCount();
      dispatch({ type: ActionTypes.SET_FORM_DATA, payload: formData });
      dispatch({
        type: ActionTypes.SET_TRANSACTION_COUNT,
        payload: transactionCount.toNumber(),
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.ACTION_FAILURE,
        payload: { message: "No ethereum object found" },
      });
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <TransactionContext.Provider
      value={{ state, dispatch, connectWallet, sendTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

const useTransaction = () => {
  return useContext(TransactionContext);
};

export { TransactionProvider, useTransaction };
