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

    if (txEvent.from !== nethermindAddr.toLowerCase()) {
      return findings;
    }

    const agentCalls = txEvent.filterFunction([createAgentSig, updateAgentSig], fortaRegAddr);

    agentCalls.forEach((call) => {
      const isCreateAgentCall = call.signature === createAgentSig;

      findings.push(
        Finding.fromObject({
          name: `Nethermind Forta Bot ${isCreateAgentCall ? "Deployment" : "Update"}`,
          description: `Bot has been ${isCreateAgentCall ? "deployed" : "updated"} by Nethermind`,
          alertId: isCreateAgentCall ? "NETHERMIND-1" : "NETHERMIND-2",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            agentID: call.args[0].toString(),
            metadata: isCreateAgentCall ? call.args[2] : call.args[1],
            chainIDs: (isCreateAgentCall ? call.args[3] : call.args[2]).join(", "),
            ...(isCreateAgentCall && { from: call.args[1] }),
          },
        })
      );
    });

    return findings;
  };
};

export default {
  handleTransaction: provideHandleTransaction(
    CREATE_AGENT_SIGNATURE,
    UPDATE_AGENT_SIGNATURE,
    NETHERMIND_ADDR,
    FORTA_REGISTRY_ADDR
  ),
};
