# Nethermind Forta Bot Monitor

## Description

This bot detects transactions related to the deployment and update of Nethermind Forta bots.

## Supported Chains

- Polygon

## Alerts

Describe each of the types of alerts fired by this bot:

- NETHERMIND-1
  - Fired when a transaction contains a call to the `createAgent` function, indicating the deployment of a new Forta bot from the Nethermind deployer address.
  - Severity is always set to "low".
  - Type is always set to "info".
  - Metadata fields included with this alert:
    - `agentID`: The ID of the deployed agent.
    - `from`: The address that deployed the agent.
    - `metadata`: Metadata associated with the deployment.
    - `chainIDs`: The IDs of the chains where the agent is deployed.

- NETHERMIND-2
  - Fired when a transaction contains a call to the `updateAgent` function, indicating an update to an existing Forta bot by the Nethermind deployer address.
  - Severity is always set to "low".
  - Type is always set to "info".
  - Metadata fields included with this alert:
    - `agentID`: The ID of the updated agent.
    - `metadata`: Metadata associated with the update.
    - `chainIDs`: The IDs of the chains where the agent is updated.

## Test Data
<samp>

createAgent : [0xf31c5dad590c84651338170883aa8cb4e4c414a06a8b6122816df44e368ef9fe](https://polygonscan.com/tx/0xf31c5dad590c84651338170883aa8cb4e4c414a06a8b6122816df44e368ef9fe) <br>
updateAgent : [0xbcc37f4a40179ad15b667c06e55761c0222c09fe1737a4bee0f5104a066e4aac](https://polygonscan.com/tx/0xbcc37f4a40179ad15b667c06e55761c0222c09fe1737a4bee0f5104a066e4aac/)

</samp>
