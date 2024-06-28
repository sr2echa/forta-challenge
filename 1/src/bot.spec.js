const {
  FindingType,
  FindingSeverity,
  Finding,
  createTransactionEvent,
} = require("forta-agent");

const {
  ethers,
} = require("@fortanetwork/forta-bot");

const {
  provideHandleTransaction,
} = require("./bot");

const { createAddress } = require("forta-agent-tools");

const { BigNumber } = require("ethers");


describe("Nethermind bot deployment to Forta Bot Registry", () => {
  let handleTransaction;
  let mockTxEvent;
  const mockNethermindDeployerAddress = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8".toLowerCase();
  const mockFortaRegistryAddress = "0x61447385B019187daa48e91c55c02AF1F1f3F863".toLowerCase();

  const DESTROY_AGENT_SIGNATURE = "function destroyAgent(uint256 agentId,address ,string metadata,uint256[] chainIds)";
  const CREATE_AGENT_SIGNATURE = "function createAgent(uint256 agentId,address ,string metadata,uint256[] chainIds)";
  const UPDATE_AGENT_SIGNATURE = "function updateAgent(uint256 agentId,string metadata,uint256[] chainIds)";

  const AGENT_ABI = new ethers.Interface([CREATE_AGENT_SIGNATURE, UPDATE_AGENT_SIGNATURE]);
  const FALSE_ABI = new ethers.Interface([DESTROY_AGENT_SIGNATURE]);

  const mockDeploymentTxOne = [
    1,
    mockNethermindDeployerAddress,
    "Mock metadata 1",
    [137],
  ];

  const mockDeploymentTxTwo = [
    2,
    mockNethermindDeployerAddress,
    "Mock metadata 2",
    [137],
  ];

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(
      CREATE_AGENT_SIGNATURE,
      UPDATE_AGENT_SIGNATURE,
      mockNethermindDeployerAddress,
      mockFortaRegistryAddress
    );
  });

  beforeEach(() => {
    mockTxEvent = createTransactionEvent({
      transaction: { from: createAddress("0x01"), to: createAddress("0x02") }
    });
  });

  it("returns empty findings if there are no bot deployments or updates", async () => {
    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("returns correct findings if there is one bot deployment from Nethermind", async () => {
    mockTxEvent = createTransactionEvent(
      { transaction: {
        from: mockNethermindDeployerAddress,
        to: mockFortaRegistryAddress,
        traces: [{
          to: mockFortaRegistryAddress,
          from: mockNethermindDeployerAddress,
          input: AGENT_ABI.encodeFunctionData("createAgent", mockDeploymentTxOne)
        }]
      }
    });

    const findings = await handleTransaction(mockTxEvent);

    expect(findings).toEqual([
      expect.objectContaining({
        name: "Nethermind Forta Bot Deployment",
        description: `New bot has been deployed from ${mockNethermindDeployerAddress}`,
        alertId: "NEWBOTDEPLOYED",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          agentID: mockDeploymentTxOne[0].toString(),
          from: mockDeploymentTxOne[1],
          metadata: mockDeploymentTxOne[2],
          chainIDs: mockDeploymentTxOne[3].join(", "),
        },
      }),
    ]);
  });
});
