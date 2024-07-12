import { Contract, utils } from "ethers";
import ABI from "@/abi/token.json";
import { Token } from "@/gen/types";

const usdtContractAddress = '0x4056B8D5854A44742ed94ecce718D5Cfa45504b8'

const usdtInterface = new utils.Interface(ABI);

export const UsdtContract = new Contract(
    usdtContractAddress,
    usdtInterface
) as Token;