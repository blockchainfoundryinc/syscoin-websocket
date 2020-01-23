export * from './ZdagStatus.service';
export * from './ZmqSocket.service';

export interface BlockCounts {
  sysTotal: number;
  sysLoaded: number;
  ethTotal: number;
  ethLoaded: number;
}

export interface NetworkStatus {
  connections: number;
  status?: 'AcceptConnection' | 'DisconnectNodes';
  statusMsg?: string;
}

export interface WalletStatus {
  name: string;
  status: string;
}

export interface GethStatus {
  geth_sync_status: string;
  geth_total_blocks: number;
  geth_current_block: number;
}

export interface PendingZdagTx {
  txid: string;
  asset_guid: number;
  zdag_status: { status: number };
  address: string;
  receivers?: { [ key: string ]: boolean };
}

export interface RpcDataObject {

}
