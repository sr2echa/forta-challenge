import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent, ethers, scanEthereum, scanPolygon } from "@fortanetwork/forta-bot";

import  {CREATE_AGENT_SIGNATURE, UPDATE_AGENT_SIGNATURE, FORTA_REGISTRY_ADDR, NETHERMIND_ADDR} from "./constants";

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent, provider: ethers.Provider) => {
  const findings: Finding[] = [];

  if (txEvent.from !== NETHERMIND_ADDR.toLowerCase()) {
    return findings;
  }

  // createAgent function calls
  const createAgentCalls = txEvent.filterFunction(CREATE_AGENT_SIGNATURE, FORTA_REGISTRY_ADDR);

  createAgentCalls.forEach((call) => {
    findings.push(
      Finding.fromObject({
        name: `Forta Bot Deployment`,
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
        name: `Forta Bot Update`,
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

function provideHandleTransaction(): HandleTransaction {
  return handleTransaction;
}

async function main() {
  scanPolygon({
    rpcUrl: "https://polygon.meowrpc.com",
    handleTransaction,
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { provideHandleTransaction };
