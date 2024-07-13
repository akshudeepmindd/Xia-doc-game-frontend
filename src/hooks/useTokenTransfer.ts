import { UsdtContract } from '@/contracts/UsdtContract'
import { useCall, useConnector, useContractFunction } from '@usedapp/core'
import { ethers } from 'ethers';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react'

const useTokenTransfer = ({ onSuccess, onError }: { onSuccess?: (response?: any) => void, onError?: (message: string) => void }): { sendToken: (recipient: string, amount: number, responseBody?: any) => Promise<void>, isPending: boolean } => {
    const { account } = useConnector();
    const [response, setResponse] = useState();
    const [status, setStatus] = useState<"PENDING" | "SUCCESS" | "ERROR">();
    const [isPending, setIsPending] = useState<boolean>(false);
    const { send, state } = useContractFunction(UsdtContract, "transferFrom", { transactionName: "Transfer" })
    const { send: approve } = useContractFunction(UsdtContract, "approve", { transactionName: "Transfer" })

    const getAllowance = useCall({ contract: UsdtContract, method: "allowance", args: [account ? account : "", UsdtContract.address] })

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
            onSuccess(response);
            setIsPending(false);
        }
        if (status === "PENDING") {
            setIsPending(true);
        }
    }, [status])

    const sendToken = async (recipient: string, amount: number, responseBody?: any) => {
        if (account) {
            setIsPending(true);
            setResponse(responseBody)
            if (!isEmpty(getAllowance?.value) && (+ethers.utils.formatEther(getAllowance?.value?.[0] ?? 1000)) > amount) {
                await approve(account, ethers.utils.parseEther((amount * 1000).toString()))
            }
            await send(account, recipient, ethers.utils.parseEther(amount.toString()));
        }

    }

    return {
        sendToken, isPending
    }
}

export default useTokenTransfer