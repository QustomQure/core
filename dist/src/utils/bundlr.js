"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyveBundlr = void 0;
const client_1 = __importDefault(require("@bundlr-network/client"));
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
const helpers_1 = require("./helpers");
class KyveBundlr {
    constructor(endpoint, privateKey) {
        this.endpoint = endpoint;
        this.bundlr = new client_1.default(endpoint, "kyve", privateKey);
        this.logger = _1.logger.getChildLogger({ name: "Bundlr" });
    }
    async fund(amount, token) {
        let _amount = amount;
        try {
            _1.logger.debug("Attempting to fetch balance.");
            const balance = await this.bundlr.getLoadedBalance();
            _1.logger.debug("Successfully fetched balance.");
            if (amount.gt(balance)) {
                _amount = amount.minus(balance);
            }
            else {
                return;
            }
        }
        catch (error) {
            _1.logger.error("❌ Received an error while trying to fetch balance:");
            _1.logger.debug(error);
            throw new Error();
        }
        const address = await this.fetchDepositAddress();
        try {
            const tx = (await token.transfer(address, (0, helpers_1.toEthersBN)(amount)));
            _1.logger.debug(`Funding with ${(0, helpers_1.toHumanReadable)(amount)} $KYVE. Transaction = ${tx.hash}`);
            await tx.wait(5);
            _1.logger.info(`🥞 Sucessfully funded.`);
        }
        catch (error) {
            _1.logger.error("❌ Received an error while trying to fund:");
            _1.logger.debug(error);
            throw new Error();
        }
    }
    createTransaction(data, opts) {
        return this.bundlr.createTransaction(data, opts);
    }
    async fetchDepositAddress() {
        try {
            _1.logger.debug("Attempting to fetch info.");
            const { data } = await axios_1.default.get(this.endpoint);
            _1.logger.debug("Successfully fetched info.");
            return data.addresses["kyve"];
        }
        catch (error) {
            _1.logger.error("❌ Received an error while trying to fetch info:");
            _1.logger.debug(error);
            throw new Error();
        }
    }
}
exports.KyveBundlr = KyveBundlr;
