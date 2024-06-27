const {
  Finding,
  FindingSeverity,
  FindingType,
  scanPolygon,
} = require("@fortanetwork/forta-bot");

const CREATE_AGENT_SIGNATURE = "function createAgent(uint256 agentId,address ,string metadata,uint256[] chainIds)";
const UPDATE_AGENT_SIGNATURE = "function updateAgent(uint256 agentId,string metadata,uint256[] chainIds)";
const FORTA_REGISTRY_ADDR = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
const NETHERMIND_ADDR = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";


const handleTransaction = async (txEvent, provider) => {
  const findings = [];

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
        alertId: "NEWBOTDEPLOYED",
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
        alertId: "BOTUPDATED",
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

async function main() {
  scanPolygon({
    rpcUrl: "https://polygon-rpc.com",
    handleTransaction,
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  handleTransaction
};
