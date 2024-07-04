import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { CREATE_AGENT_SIGNATURE, UPDATE_AGENT_SIGNATURE, FORTA_REGISTRY_ADDR, NETHERMIND_ADDR } from "./constants";

export const provideHandleTransaction = (
  createAgentSig: string,
  updateAgentSig: string,
  nethermindAddr: string,
  fortaRegAddr: string
): HandleTransaction => {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    // return empty findings if txn event != Nethermind
    if (txEvent.from !== nethermindAddr.toLowerCase()) {
      return findings;
    }

  // createAgent function calls
    const createAgentCalls = txEvent.filterFunction(CREATE_AGENT_SIGNATURE, FORTA_REGISTRY_ADDR);

    createAgentCalls.forEach((call) => {
      findings.push(
        Finding.fromObject({
          name: `Nethermind Forta Bot Deployment`,
          description: `New bot has been deployed by Nethermind`,
          alertId: "NETHERMIND-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,   
          metadata: {
            agentID: call.args[0].toString(),
            from: call.args[1],
            metadata: call.args[2],
            chainIDs: call.args[3].join(", "),
          },
        })
      );
    });

    // updateAgent function calls
    const updateAgentCalls = txEvent.filterFunction(UPDATE_AGENT_SIGNATURE, FORTA_REGISTRY_ADDR);

    updateAgentCalls.forEach((call) => {
      findings.push(
        Finding.fromObject({
          name: `Nethermind Forta Bot Updated`,
          description: `Bot has been updated by Nethermind`,
          alertId: "NETHERMIND-2",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            agentID: call.args[0].toString(),
            metadata: call.args[1],
            chainIDs: call.args[2].join(", "),
          },
        })
      );
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(
    CREATE_AGENT_SIGNATURE,
    UPDATE_AGENT_SIGNATURE,
    NETHERMIND_ADDR,
    FORTA_REGISTRY_ADDR
  ),
};
