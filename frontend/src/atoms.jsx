import { atom, useRecoilCallback } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    _id:''
  }
});

export const balanceState = atom({
  key: 'balanceState',
  default: {
    balance : '0'
  }
});

export const toAccountState = atom({
  key: 'toAccountState',
  default: {
    toAccountId : ""
  }
});

export const tokenState = atom({
    key : 'tokenState',
    default : {
        token : ""
    }
})

export const useSetUserState = () =>
  useRecoilCallback(({ set }) => {
    return (field, value) => {
      set(userState, (prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  });
