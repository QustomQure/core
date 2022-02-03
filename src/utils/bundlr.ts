import Bundlr from "@bundlr-network/client";
import BundlrTransaction from "@bundlr-network/client/build/common/transaction";
import { DataItemCreateOptions } from "arbundles";
import axios from "axios";
import BigNumber from "bignumber.js";
import { Contract, ContractTransaction } from "ethers";
import { Logger } from "tslog";
import { logger } from ".";
import { toEthersBN, toHumanReadable } from "./helpers";

interface InfoResponse {
  version: string;
  addresses: Record<string, string>;
  gateway: string;
}

export class KyveBundlr {
  endpoint: string;
  bundlr: Bundlr;
  logger: Logger;

  constructor(endpoint: string, privateKey: string) {
    this.endpoint = endpoint;
    this.bundlr = new Bundlr(endpoint, "kyve", privateKey);
    this.logger = logger.getChildLogger({ name: "Bundlr" });
  }

  public async fund(amount: BigNumber, token: Contract): Promise<void> {
    let _amount = amount;

    try {
      logger.debug("Attempting to fetch balance.");
      const balance = await this.bundlr.getLoadedBalance();
      logger.debug("Successfully fetched balance.");

      if (amount.gt(balance)) {
        _amount = amount.minus(balance);
      } else {
        return;
      }
    } catch (error) {
      logger.error("❌ Received an error while trying to fetch balance:");
      logger.debug(error);
      throw new Error();
    }

    const address = await this.fetchDepositAddress();

    try {
      const tx = (await token.transfer(
        address,
        toEthersBN(amount)
      )) as ContractTransaction;
      logger.debug(
        `Funding with ${toHumanReadable(amount)} $KYVE. Transaction = ${
          tx.hash
        }`
      );

      await tx.wait(5);
      logger.info(`🥞 Sucessfully funded.`);
    } catch (error) {
      logger.error("❌ Received an error while trying to fund:");
      logger.debug(error);
      throw new Error();
    }
  }

  public createTransaction(
    data: string | Uint8Array,
    opts?: DataItemCreateOptions
  ): BundlrTransaction {
    return this.bundlr.createTransaction(data, opts);
  }

  private async fetchDepositAddress(): Promise<string> {
    try {
      logger.debug("Attempting to fetch info.");
      const { data } = await axios.get<InfoResponse>(this.endpoint);
      logger.debug("Successfully fetched info.");

      return data.addresses["kyve"];
    } catch (error) {
      logger.error("❌ Received an error while trying to fetch info:");
      logger.debug(error);
      throw new Error();
    }
  }
}
