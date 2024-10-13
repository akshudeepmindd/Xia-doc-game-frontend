import http from '.';

export const userLoginService = async (payload: { telegramusername: string; password: string }) => {
  const { data } = await http.post('User/login', payload);
  return data;
};

export const userRegister = async (payload: { telegramusername: string; password: string }) => {
  const { data } = await http.post('User/register', payload);
  return data;
};

export const updateUser = async (payload: { userId: string; body: { balance: number, depositRequest?: boolean } }) => {
  const { data } = await http.patch(`User/update/${payload.userId}`, payload.body);
  return data;
};

export const userProfile = async (userId: string) => {
  const { data } = await http.get(`user/profile/${userId}`);
  return data;
};

export const rechargeXusdt = async (payload: { amount: number }) => {
  const { data } = await http.patch('User/updateWallet', payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};

export const executePayment = async (payload: {
  amount: number;
  bankCode: string;
  depositorBankName: string;
  depositorName: string;
  depositorBankAcctNo: string;
  channel: string;
  bankName: string;
  userId: string | null;
}) => {
  const { data } = await http.post('payments/pay', payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};
export const createPaymentTransaction = async (payload: { amount: number; from: string }) => {
  const { data } = await http.post('payments/transaction', payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};

export const UpdatePaymentTransactionStatus = async (payload: { id: string; status: string }) => {
  const { data } = await http.patch(`payments/transaction/${payload.id}`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data;
};
export const CreateWithdrawRequest = async (payload: {
  amount: number;
  from: string | null;
  bankBranch: string;
  depositorBankName: string;
  depositorName: string;
  depositorBankAcctNo: string;
}) => {
  const { data } = await http.post(`withdrawl-request`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data;
};
export const FetchUserWithdrawlRequest = async (payload: { id: string }) => {
  const { data } = await http.get(`withdrawl-request/UserRequest/${payload.id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return data;
};

