# Nethermind Forta Bot Monitor

## Description

This bot detects transactions related to the deployment and update of Nethermind Forta bots.

## Supported Chains

- Polygon
- Ethereum

## Alerts

Describe each of the types of alerts fired by this bot:

- NEWBOTDEPLOYED
  - Fired when a transaction contains a call to the `createAgent` function, indicating the deployment of a new Forta bot from the Nethermind deployer address.
  - Severity is always set to "low".
  - Type is always set to "info".
  - Metadata fields included with this alert:
    - `agentID`: The ID of the deployed agent.
    - `from`: The address that deployed the agent.
    - `metadata`: Metadata associated with the deployment.
    - `chainIDs`: The IDs of the chains where the agent is deployed.

- BOTUPDATED
  - Fired when a transaction contains a call to the `updateAgent` function, indicating an update to an existing Forta bot by the Nethermind deployer address.
  - Severity is always set to "low".
  - Type is always set to "info".
  - Metadata fields included with this alert:
    - `agentID`: The ID of the updated agent.
    - `metadata`: Metadata associated with the update.
    - `chainIDs`: The IDs of the chains where the agent is updated.


