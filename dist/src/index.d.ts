import { JWKInterface } from "arweave/node/lib/wallet";
import { OptionValues } from "commander";
import { BundlerFunction } from "./faces";
import { CLI } from "./utils";
export * from "./utils";
declare class KYVE {
    private pool;
    private node;
    private runtime;
    private version;
    private stake;
    private wallet;
    private keyfile?;
    private name;
    private gasMultiplier;
    private metadata;
    private settings;
    private config;
    private client;
    constructor(poolAddress: string, runtime: string, version: string, stakeAmount: string, privateKey: string, keyfile?: JWKInterface, name?: string, endpoint?: string, gasMultiplier?: string, verbose?: boolean);
    static generate(cli?: CLI): Promise<{
        node: KYVE;
        options: OptionValues;
    }>;
    start<ConfigType>(createBundle: BundlerFunction<ConfigType>): Promise<void>;
    private run;
    private getBlockProposal;
    private getBlockInstructions;
    private uploadBundleToArweave;
    private submitBlockProposal;
    private waitForNextBlockInstructions;
    private validateCurrentBlockProposal;
    private vote;
    private logNodeInfo;
    private setupListeners;
    private fetchPoolState;
    private checkVersionRequirements;
    private checkRuntimeRequirements;
    private setupNodeContract;
    private selfDelegate;
    private selfUndelegate;
}
export default KYVE;
