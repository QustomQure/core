import Bundlr from "@bundlr-network/client";
import BundlrTransaction from "@bundlr-network/client/build/common/transaction";
import { DataItemCreateOptions } from "arbundles";
import BigNumber from "bignumber.js";
import { Contract } from "ethers";
import { Logger } from "tslog";
export declare class KyveBundlr {
    endpoint: string;
    bundlr: Bundlr;
    logger: Logger;
    constructor(endpoint: string, privateKey: string);
    fund(amount: BigNumber, token: Contract): Promise<void>;
    createTransaction(data: string | Uint8Array, opts?: DataItemCreateOptions): BundlrTransaction;
    private fetchDepositAddress;
}
