import { UsdtContract } from '@/contracts/UsdtContract'
import { useConnector, useContractFunction } from '@usedapp/core'
import { ethers } from 'ethers';
import React, { useMemo, useState } from 'react'

const useTokenTransfer = ({ onSuccess, onError }: { onSuccess?: () => void, onError?: (message: string) => void }): { sendToken: (recipient: string, amount: number) => Promise<void>, isPending: boolean } => {
    const { account } = useConnector();
    const [status, setStatus] = useState<"PENDING" | "SUCCESS" | "ERROR">();
    const [isPending, setIsPending] = useState<boolean>(false);
    const { send, state } = useContractFunction(UsdtContract, "transferFrom", { transactionName: "Transfer" })
    const { send: allowance, state: allowanceState } = useContractFunction(UsdtContract, "approve", { transactionName: "Transfer" })

    useMemo(() => {
        if (state.status === "PendingSignature") {
            setStatus("PENDING");
        }

        if (state.status === "Success") {
            setStatus("SUCCESS")
        }

        if (state.status === "Exception") {
            setStatus("ERROR")
        }
    }, [state.status])

    useMemo(() => {
        if (status === "ERROR" && onError) {
            onError(state?.errorMessage || "Something went wrong!");
            setIsPending(false);
        }
        if (status === "SUCCESS" && onSuccess) {
            onSuccess();
            setIsPending(false);
        }
        if (status === "PENDING") {
            setIsPending(true);
        }
    }, [status])

    const sendToken = async (recipient: string, amount: number) => {
        if (account) {
            setIsPending(true);
            await allowance(account, ethers.utils.parseEther((amount * 1000).toString()))
            await send(account, recipient, ethers.utils.parseEther(amount.toString()));
        }

    }

    return {
        sendToken, isPending
    }
}

export default useTokenTransfer